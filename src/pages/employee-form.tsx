import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '../components/page-header';

import { useApp } from '../lib/context';
import { Employee } from '../lib/data';
import { FormInput } from '../components/form-input';

type EmployeeFormData = Omit<Employee, 'id' | 'joined_at'>;

export function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, addEmployee, updateEmployee } = useApp();

  const isEditing = !!id;
  const employee = isEditing ? getEmployeeById(Number(id)) : null;

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: employee || undefined,
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEditing && employee) {
        await updateEmployee(employee.id, data);
      } else {
        await addEmployee({ ...data, joined_at: new Date().toISOString() });
      }
      navigate(isEditing ? `/employees/${id}` : '/employees');
    } catch (error) {
      // Error toast is already shown in context
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Employee' : 'Create Employee'}
        description={isEditing ? 'Update the details of the existing employee.' : 'Add a new employee to the team.'}
        onBack={() => navigate(isEditing ? `/employees/${id}` : '/employees')}
        actions={[
          {
            label: isEditing ? 'Update' : 'Save',
            type: 'submit',
          },
          {
            label: 'Cancel',
            variant: 'outline',
            onClick: () => navigate(isEditing ? `/employees/${id}` : '/employees'),
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          id="first_name"
          label="First Name"
          placeholder="John"
          {...register('first_name', { required: 'First name is required' })}
          error={errors.first_name?.message}
          required
        />
        <FormInput
          id="last_name"
          label="Last Name"
          placeholder="Doe"
          {...register('last_name', { required: 'Last name is required' })}
          error={errors.last_name?.message}
          required
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
          })}
          error={errors.email?.message}
          required
        />
        <FormInput
          id="phone"
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...register('phone', { required: 'Phone number is required' })}
          error={errors.phone?.message}
          required
        />
        <div className="sm:col-span-2">
          <FormInput
            id="role"
            label="Role"
            placeholder="Software Engineer"
            {...register('role', { required: 'Role is required' })}
            error={errors.role?.message}
            required
          />
        </div>
      </div>
    </form>
  );
}
