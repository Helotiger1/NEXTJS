'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, MailOpen, PhoneCall, MapPinned } from 'lucide-react';
import toast from 'react-hot-toast';
import UserProfile from '@/app/(roles)/(shared)/components/profile/components/UserProfile';

export default function EditarPerfilCliente() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
    <UserProfile></UserProfile>
    </motion.div>
  );
}