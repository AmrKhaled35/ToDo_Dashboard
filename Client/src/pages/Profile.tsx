import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit3 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth(); // Assuming `updateUser` is from context
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPreviewAvatar(user.avatar);
    }
  }, [user]);

  const avatarOptions = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && email) {
      updateUser({
        name,
        email,
        avatar: previewAvatar,
      });
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPreviewAvatar(user?.avatar || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-6">Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center bg-gray-800 rounded-lg">
              <div className="relative mb-4">
                <img
                  src={previewAvatar}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} />
                </Button>
              </div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-gray-400">{user?.email}</p>
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center text-gray-400">
                  <User size={18} className="mr-2" />
                  <span>Member since {formatDate('2023-01-15')}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Calendar size={18} className="mr-2" />
                  <span>Last active: Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">User Information</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={<Edit3 size={16} />}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar
                    </label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {avatarOptions.map((avatarUrl) => (
                        <button
                          key={avatarUrl}
                          type="button"
                          className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${
                            previewAvatar === avatarUrl
                              ? 'border-indigo-500'
                              : 'border-transparent'
                          }`}
                          onClick={() => setPreviewAvatar(avatarUrl)}
                        >
                          <img
                            src={avatarUrl}
                            alt="Avatar option"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-700">
                    <div className="flex">
                      <User size={20} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pb-4 border-b border-gray-700">
                    <div className="flex">
                      <Mail size={20} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 bg-gray-800">
            <CardHeader>
              <h3 className="text-lg font-semibold">Account Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                <div className="py-3 flex justify-between">
                  <span className="text-gray-400">Completed Tasks</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-400">On Time Completion Rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-400">Average Completion Time</span>
                  <span className="font-medium">2.5 days</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-400">Most Active Category</span>
                  <span className="font-medium">Work</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
