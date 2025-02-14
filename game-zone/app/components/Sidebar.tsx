'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        {
            title: 'Users',
            path: '/dashboard',
            icon: '👥'
        },
        {
            title: 'Games',
            path: '/dashboard/games',
            icon: '🎮'
        },
        {
            title: 'Categories',
            path: '/dashboard/categories',
            icon: '📁'
        }
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 pt-20 mt-15">
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors ${pathname === item.path ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
