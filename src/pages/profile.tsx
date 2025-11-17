import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Edit, Settings, Upload, Camera, Bell, Shield } from 'lucide-react';
import { PageHeader } from '../components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EmployeeAvatar } from '../components/employee-avatar';
import { DetailItem } from '../components/detail-item';
import { useApp } from '../lib/context';
import { format } from 'date-fns';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    darkMode: false
  });
  
  const firstName = user?.user_metadata?.first_name || 'User';
  const lastName = user?.user_metadata?.last_name || '';
  const email = user?.email || '';
  const createdAt = user?.created_at || new Date().toISOString();

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account information"
        onBack={() => navigate('/')}
      />

      <div className="max-w-2xl mx-auto">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <EmployeeAvatar
                firstName={firstName}
                lastName={lastName}
                size="lg"
              />
            </div>
            <CardTitle className="text-2xl">
              {firstName} {lastName}
            </CardTitle>
            <p className="text-muted-foreground">{email}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <DetailItem 
                icon={User} 
                label="Full Name" 
                value={`${firstName} ${lastName}`} 
              />
              <DetailItem 
                icon={Mail} 
                label="Email" 
                value={email}
                href={`mailto:${email}`}
              />
              <DetailItem 
                icon={Calendar} 
                label="Member Since" 
                value={format(new Date(createdAt), 'MMMM d, yyyy')} 
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}