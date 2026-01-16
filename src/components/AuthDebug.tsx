import { useAuth } from '../contexts/AuthContext';

export default function AuthDebug() {
    const { user, token, isAdmin } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs font-mono max-w-sm shadow-lg border border-gray-700 z-50">
            <div className="mb-2 font-bold border-b border-gray-700 pb-2">🔐 Auth Debug</div>
            <div className="space-y-1">
                <div>
                    <span className="text-green-400">User:</span> {user ? `${user.name} (${user.role})` : '❌ Not logged in'}
                </div>
                <div>
                    <span className="text-green-400">Token:</span> {token ? '✅ Present' : '❌ Missing'}
                </div>
                <div>
                    <span className="text-green-400">Admin:</span> {isAdmin ? '✅ Yes' : '❌ No'}
                </div>
                {token && (
                    <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
                        <div className="text-yellow-400">Token (first 20 chars):</div>
                        <div className="truncate">{token.substring(0, 20)}...</div>
                    </div>
                )}
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
                    <div className="text-yellow-400">Console (F12):</div>
                    <div>Ouvrez la console pour voir les logs détaillés</div>
                </div>
            </div>
        </div>
    );
}
