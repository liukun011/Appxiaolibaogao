
import React, { useState } from 'react';
import MobileFrame from './components/MobileFrame';
import QuickLogin from './screens/QuickLogin';
import SMSLogin from './screens/SMSLogin';
import ResetPassword from './screens/ResetPassword';
import MainContainer from './screens/MainContainer';
import { Screen, User, Organization } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.QUICK_LOGIN);
  const [user, setUser] = useState<User | null>(null);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (phone: string) => {
    const mockOrgs: Organization[] = [
      { 
        id: 'org_1', 
        name: '小狸科技官方', 
        role: 'ADMIN' as const,
        members: [
          { id: 'm1', name: '张三', phone: '13800000001', role: 'OWNER', avatar: 'https://picsum.photos/seed/m1/100/100' },
          { id: 'm2', name: '李四', phone: '13800000002', role: 'ADMIN', avatar: 'https://picsum.photos/seed/m2/100/100' },
          { id: 'm3', name: '王五', phone: '13800000003', role: 'MEMBER', avatar: 'https://picsum.photos/seed/m3/100/100' },
          { id: 'm4', name: '赵六', phone: '13800000004', role: 'MEMBER', avatar: 'https://picsum.photos/seed/m4/100/100' },
        ],
        departments: [
          { id: 'd1', name: '销售部' },
          { id: 'd2', name: '技术部' },
          { id: 'd3', name: '运营部' },
        ]
      },
      { 
        id: 'org_2', 
        name: '某某销售团队', 
        role: 'MEMBER' as const,
        members: [
          { id: 'm5', name: '陈经理', phone: '13900000001', role: 'OWNER', avatar: 'https://picsum.photos/seed/m5/100/100' },
          { id: 'm6', name: '小王', phone: '13900000002', role: 'MEMBER', avatar: 'https://picsum.photos/seed/m6/100/100' },
        ],
        departments: [
          { id: 'd4', name: '华东区' },
          { id: 'd5', name: '华南区' },
        ]
      },
      { 
        id: 'org_3', 
        name: '华北分公司', 
        role: 'ADMIN' as const,
        members: [
          { id: 'm7', name: '刘总', phone: '13700000001', role: 'OWNER', avatar: 'https://picsum.photos/seed/m7/100/100' },
          { id: 'm8', name: '我', phone: '13700000002', role: 'ADMIN', avatar: 'https://picsum.photos/seed/m8/100/100' },
        ],
        departments: [
          { id: 'd6', name: '市场部' },
          { id: 'd7', name: '人事部' },
        ]
      },
      { 
        id: 'org_4', 
        name: '社区志愿者协会', 
        role: 'MEMBER' as const,
        members: [
          { id: 'm9', name: '老王', phone: '13600000001', role: 'OWNER', avatar: 'https://picsum.photos/seed/m9/100/100' },
          { id: 'm10', name: '小李', phone: '13600000002', role: 'MEMBER', avatar: 'https://picsum.photos/seed/m10/100/100' },
        ],
        departments: [
          { id: 'd8', name: '外联组' },
          { id: 'd9', name: '宣传组' },
        ]
      }
    ];
    const mockInvitedUsers = [
      { id: 'inv_1', name: '张三', avatar: 'https://picsum.photos/seed/user1/100/100', joinDate: '2024-03-10' },
      { id: 'inv_2', name: '李四', avatar: 'https://picsum.photos/seed/user2/100/100', joinDate: '2024-03-12' },
      { id: 'inv_3', name: '王五', avatar: 'https://picsum.photos/seed/user3/100/100', joinDate: '2024-03-15' }
    ];
    setUser({ 
      phone, 
      isLoggedIn: true, 
      organizations: mockOrgs,
      activeOrgId: mockOrgs[0].id,
      invitedUsers: mockInvitedUsers
    });
    setCurrentScreen(Screen.MAIN);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(Screen.QUICK_LOGIN);
  };

  const renderScreen = () => {
    if (user?.isLoggedIn && currentScreen === Screen.MAIN) {
      return <MainContainer user={user} setUser={setUser} onLogout={handleLogout} />;
    }

    switch (currentScreen) {
      case Screen.QUICK_LOGIN:
        return <QuickLogin onNavigate={handleNavigate} onLogin={handleLogin} />;
      case Screen.SMS_LOGIN:
        return <SMSLogin onNavigate={handleNavigate} onLogin={handleLogin} />;
      case Screen.RESET_PASSWORD:
        return <ResetPassword onNavigate={handleNavigate} />;
      default:
        return <QuickLogin onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
  };

  return (
    <MobileFrame>
      {renderScreen()}
    </MobileFrame>
  );
};

export default App;
