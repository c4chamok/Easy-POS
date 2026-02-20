import { POSProvider, usePOS } from '@/context/POSContext';
import { CartProvider } from '@/context/CartContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { SalesTab } from '@/components/tabs/SalesTab';
import { InventoryTab } from '@/components/tabs/InventoryTab';
import { OrdersTab } from '@/components/tabs/OrdersTab';

function POSContent() {
  const { activeTab } = usePOS();

  return (
    <MainLayout>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'sales' && <SalesTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'orders' && <OrdersTab />}
    </MainLayout>
  );
}

const Index = () => {
  return (
    <POSProvider>
      <CartProvider>
        <POSContent />
      </CartProvider>
    </POSProvider>
  );
};

export default Index;
