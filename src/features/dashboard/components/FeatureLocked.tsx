import { Lock } from 'lucide-react';
import Link from 'next/link';

interface FeatureLockedProps {
    title: string;
    description: string;
}

export default function FeatureLocked({ title, description }: FeatureLockedProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="text-gray-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md mb-8">{description}</p>
            <Link
                href="/dashboard/settings"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
                Fazer Upgrade
            </Link>
        </div>
    );
}
