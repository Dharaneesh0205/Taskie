import { Menu, Search, LogOut, CheckSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmployeeAvatar } from '../employee-avatar';
import { NotificationDropdown } from '../notifications';
import { useApp } from '../../lib/context';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { signOut, user, employees, tasks } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Search logic
  const searchResults = searchQuery.trim().length >= 1 ? {
    employees: employees.filter(emp =>
      emp.first_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5),
    tasks: tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5),
  } : { employees: [], tasks: [] };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.trim().length >= 1);
  };

  const navigateToResult = (type: 'employee' | 'task', id: number) => {
    setShowResults(false);
    setSearchQuery('');
    if (type === 'employee') {
      navigate(`/employees/${id}`);
    } else {
      navigate(`/tasks/${id}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex h-14 md:h-18 items-center gap-4 px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search - visible on desktop */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees, tasks..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowResults(searchQuery.trim().length >= 1)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="pl-10 bg-muted/50 border-0 rounded-lg"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchQuery.trim() && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
                {searchResults.employees.length === 0 && searchResults.tasks.length === 0 && (
                  <div className="px-4 py-3 text-muted-foreground flex items-center gap-3">
                    <Search className="w-4 h-4" />
                    <span>No results found for "{searchQuery}"</span>
                  </div>
                )}
                {searchResults.employees.map(emp => (
                  <button
                    key={`emp-${emp.id}`}
                    onClick={() => navigateToResult('employee', emp.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 first:pt-3 last:pb-3"
                  >
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground">{emp.first_name} {emp.last_name}</span>
                      <span className="text-muted-foreground ml-2">- {emp.role}</span>
                    </div>
                  </button>
                ))}
                {searchResults.tasks.map(task => (
                  <button
                    key={`task-${task.id}`}
                    onClick={() => navigateToResult('task', task.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 first:pt-3 last:pb-3"
                  >
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground">{task.title}</span>
                      <span className="text-muted-foreground ml-2">- {task.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <NotificationDropdown />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>

          <button
            onClick={() => navigate('/profile')}
            className="rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
            aria-label="View Profile"
            title="View Profile"
          >
            <EmployeeAvatar
              firstName={user?.user_metadata?.first_name || 'User'}
              lastName={user?.user_metadata?.last_name || ''}
              size="sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
}