import dynamic from 'next/dynamic';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken';

const Dashboard = dynamic(() => import('@/components/brain/Dashboard'), {
  ssr: false,
});

export default async function Page() {
  let accessToken: string | null = null;
  try {
    accessToken = await getHumeAccessToken();
  } catch {}

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Dashboard accessToken={accessToken} />
    </div>
  );
}
