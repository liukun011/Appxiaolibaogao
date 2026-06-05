import React from 'react';
import { Screen } from '../types';
import QuickLogin from './QuickLogin';

interface SMSLoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (phone: string) => void;
}

const SMSLogin: React.FC<SMSLoginProps> = (props) => {
  return <QuickLogin {...props} />;
};

export default SMSLogin;
