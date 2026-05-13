'use client';

import { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toaster';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ firstName: 'Demo', lastName: 'Trader', email: 'demo@nextrade.io', phone: '+1 234 567 890' });
  const toast = useToast();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <Tabs tabs={[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }, { id: 'notifications', label: 'Notifications' }]} activeTab={activeTab} onChange={setActiveTab} variant="underline" />

      {activeTab === 'profile' && (
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-bold text-white">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <Button variant="secondary" size="sm" leftIcon={<Camera className="w-4 h-4" />}>Change Avatar</Button>
              <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
            <Input label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            <Input label="Email" value={profile.email} leftIcon={<Mail className="w-4 h-4" />} />
            <Input label="Phone" value={profile.phone} leftIcon={<User className="w-4 h-4" />} />
          </div>
          <Button className="mt-6" onClick={() => toast.success('Profile updated')}>Save Changes</Button>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card variant="glass" padding="lg">
            <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <Input label="Current Password" type="password" leftIcon={<Lock className="w-4 h-4" />} />
              <Input label="New Password" type="password" leftIcon={<Lock className="w-4 h-4" />} />
              <Input label="Confirm New Password" type="password" leftIcon={<Lock className="w-4 h-4" />} />
              <Button onClick={() => toast.success('Password changed')}>Update Password</Button>
            </div>
          </Card>
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-400 mt-1">Add an extra layer of security to your account</p>
              </div>
              <Badge variant="amber" dot>Disabled</Badge>
            </div>
            <Button variant="secondary" className="mt-4" leftIcon={<Shield className="w-4 h-4" />}>Enable 2FA</Button>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'Trade executed', description: 'Get notified when your trade is executed', defaultOn: true },
              { label: 'Trade closed', description: 'Get notified when a trade closes with P&L', defaultOn: true },
              { label: 'Deposit confirmed', description: 'Notification when deposit is credited', defaultOn: true },
              { label: 'AI insights', description: 'Daily AI market insights and alerts', defaultOn: false },
              { label: 'Security alerts', description: 'Login attempts and security events', defaultOn: true },
              { label: 'Marketing emails', description: 'Product updates and promotions', defaultOn: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-3 border-b border-surface-3/20 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{pref.label}</p>
                  <p className="text-xs text-slate-400">{pref.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={pref.defaultOn} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:bg-brand-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
