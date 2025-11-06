import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Paper, Chip, Switch } from '@mui/material';
import { Phone, LocationOn, Store, AttachMoney, Inventory } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { numberFormat } from 'utils/numberFormat';
import useCommonContext from 'context/useCommon';
import { get } from 'lodash';
import { getStoresFromLocalStorage, activateStoreInLocalStorage, ILocalStore } from '../utils/localStorageUtils';
import { toast } from 'react-toastify';
import { useApiMutation, useApi } from 'hooks/useApi/useApiHooks';

interface StoreCardProps {
  storeInfoData: any;
  storeId: string;
  onStatusChange?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  storeInfoData,
  storeId,
  onStatusChange,
}) => {
  const {
    state: { data: settingsData },
  } = useCommonContext();

  const { t } = useTranslation();

  const { mutate: activateStore } = useApiMutation("store/activate", "put", {
    onSuccess() {
      toast.success(t("general.success"));
      onStatusChange?.();
    },
    onError() {
      toast.error("Xatolik yuz berdi");
    },
  });

  // localStorage yoki API dan ma'lumot olish
  const store = storeId?.startsWith('store_') 
    ? getStoresFromLocalStorage().find((s) => s._id === storeId)
    : storeInfoData?.data;

  // Tovarlar sonini olish (API tayyor bo'lganda)
  // const { data: productsData } = useApi(
  //   `product/paging`,
  //   {
  //     storeId: storeId,
  //     limit: 1,
  //   },
  //   {
  //     enabled: !!storeId && !storeId?.startsWith('store_'),
  //     suspense: false,
  //   }
  // );

  const totalProducts = storeId?.startsWith('store_')
    ? 0 // localStorage'dan tovarlar sonini olish mumkin emas
    : store?.totalProducts || 0;

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isActive = event.target.checked;
    
    if (storeId?.startsWith('store_')) {
      // localStorage'dan o'zgartirish
      const stores = getStoresFromLocalStorage();
      const localStore = stores.find((s) => s._id === storeId);
      if (localStore) {
        localStore.isActive = isActive;
        localStore.updatedAt = new Date().toISOString();
        localStorage.setItem("stores_restaurants_local", JSON.stringify(stores));
        toast.success(isActive ? "Do'kon aktivlashtirildi!" : "Do'kon nofaol qilindi!");
        onStatusChange?.();
      }
    } else {
      // API orqali o'zgartirish (keyinchalik)
      if (isActive) {
        activateStore({ id: storeId });
      }
    }
  };

  if (!store) {
    return <div>Yuklanmoqda...</div>;
  }

  const logoUrl = store.logoId 
    ? `${process.env.REACT_APP_BASE_URL}/image/${store.logoId}`
    : undefined;

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #EB7B00 0%, #EB5B00 100%)',
        pt: 6,
        pb: 8,
        px: 4,
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <Avatar
          src={logoUrl}
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            border: '4px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <Store sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
          {store.name}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Chip
            label={store.isActive ? "✅ Faol" : "🟥 Nofaol"}
            sx={{
              backgroundColor: store.isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Chip
            label={store.category === "Do'kon" || store.categoryId === "store" ? "Do'kon" : "Restoran"}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{
        backgroundColor: 'white',
        borderRadius: '20px 20px 0 0',
        px: 4,
        py: 3
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: '#F7FAFC',
            borderRadius: 2,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'translateX(8px)'
            }
          }}>
            <Phone style={{ fontSize: 20, color: '#EB5B00' }} />
            <Typography variant="body1" color="text.primary">
              {store.phoneNumber}
            </Typography>
          </Box>

          {store.addressName && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: '#F7FAFC',
              borderRadius: 2,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateX(8px)'
              }
            }}>
              <LocationOn style={{ fontSize: 20, color: '#EB5B00' }} />
              <Typography variant="body1" color="text.primary">
                {store.addressName}
              </Typography>
            </Box>
          )}

          {store.commissionPercent !== undefined && store.commissionPercent > 0 && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: '#F7FAFC',
              borderRadius: 2,
            }}>
              <AttachMoney style={{ fontSize: 20, color: '#EB5B00' }} />
              <Typography variant="body1" color="text.primary">
                Komissiya: {store.commissionPercent}%
              </Typography>
            </Box>
          )}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: '#F7FAFC',
            borderRadius: 2,
          }}>
            <Inventory style={{ fontSize: 20, color: '#EB5B00' }} />
            <Typography variant="body1" color="text.primary">
              Tovarlar soni: {totalProducts}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            backgroundColor: '#F7FAFC',
            borderRadius: 2,
            mt: 2
          }}>
            <Typography variant="body1" fontWeight="bold">
              Holatni o'zgartirish:
            </Typography>
            <Switch
              checked={store.isActive || false}
              onChange={handleStatusChange}
              color="primary"
            />
          </Box>
        </Box>
      </CardContent>
    </Paper>
  );
};

