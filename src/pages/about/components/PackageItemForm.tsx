import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Checkbox,
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { ImageInput } from 'components';
import { toast } from 'react-toastify';
import { ChevronRight, ExpandMore, CheckCircle, CloudUpload, Close } from '@mui/icons-material';
import api from 'services/client/client';
import usePostImage from 'hooks/usePostImage';

interface PackageItem {
  _id?: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  price: number;
  categoryIds?: string[];
  imageId?: string;
  image?: {
    url?: string;
    _id?: string;
  } | string;
  isActive?: boolean;
}

interface PackageItemFormProps {
  open: boolean;
  onClose: () => void;
  packageItem?: PackageItem | null;
  onSave: (data: PackageItem) => void;
}

const normalizeId = (id: any): string | null => {
  if (!id) return null;
  if (typeof id === 'object' && id.$oid) {
    return String(id.$oid);
  }
  if (typeof id === 'object' && id.toString) {
    return String(id.toString());
  }
  return String(id);
};

const buildCategoryTree = (categories: any[]) => {
  if (!categories || categories.length === 0) return [];

  const normalizedCategories = categories.map(cat => ({
    ...cat,
    _id: normalizeId(cat._id) || cat._id,
    parentId: normalizeId(cat.parentId) || cat.parentId,
  }));

  const categoryMap = new Map();
  normalizedCategories.forEach(cat => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });

  const rootCategories: any[] = [];
  normalizedCategories.forEach(cat => {
    const category = categoryMap.get(cat._id);
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  const cleanTree = (nodes: any[]): any[] => {
    return nodes.map(node => ({
      ...node,
      children: node.children && node.children.length > 0 ? cleanTree(node.children) : undefined,
    }));
  };

  return cleanTree(rootCategories);
};

const PACKAGE_OPTIONS = [
  {
    id: 'paper-bag',
    name: { uz: 'Qog\'oz paket', ru: 'Бумажный пакет', en: 'Paper bag' },
    image: '/assets/packages/paper-bag.jpeg',
  },
  {
    id: 'plastic-container',
    name: { uz: 'Plastik idish', ru: 'Пластиковый контейнер', en: 'Plastic container' },
    image: '/assets/packages/plastic-container.jpg',
  },
  {
    id: 'plastic-package',
    name: { uz: 'Plastik paket', ru: 'Пластиковая упаковка', en: 'Plastic package' },
    image: '/assets/packages/plastic-package.webp',
  },
  {
    id: 'reusable-bag',
    name: { uz: 'Mato sumka', ru: 'Тканевая сумка', en: 'Fabric bag' },
    image: '/assets/packages/reusable-bag.jpeg',
  },
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                resolve(file);
              }
            },
            file.type,
            0.9
          );
        } else {
          resolve(file);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const fetchAllCategories = async (): Promise<any[]> => {
  const allCategories: any[] = [];
  const limit = 200;

  const normalizeIdToString = (id: any): string | null => {
    if (!id) return null;
    if (typeof id === 'object' && id.toString) {
      return id.toString();
    }
    return String(id);
  };

  const fetchRootCategories = async () => {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await api.post('/category/paging', {
        page,
        limit,
      });

      let categoriesList: any[] = [];
      if (response?.data && Array.isArray(response.data)) {
        categoriesList = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        categoriesList = response.data.data;
      }

      allCategories.push(...categoriesList);

      const total = response?.data?.total || 0;
      hasMore = categoriesList.length === limit && allCategories.length < total;
      page++;
    }
  };

  const fetchSubcategories = async (parentId: string) => {
    const parentIdString = normalizeIdToString(parentId);
    if (!parentIdString) return;

    let subPage = 1;
    let subHasMore = true;
    const subCategories: any[] = [];

    while (subHasMore) {
      const subResponse = await api.post('/category/paging', {
        page: subPage,
        limit,
        parentId: parentIdString,
      });

      let subCategoriesList: any[] = [];
      if (subResponse?.data && Array.isArray(subResponse.data)) {
        subCategoriesList = subResponse.data;
      } else if (subResponse?.data?.data && Array.isArray(subResponse.data.data)) {
        subCategoriesList = subResponse.data.data;
      }

      const newCategories = subCategoriesList.filter(
        (cat) => {
          const catId = normalizeIdToString(cat._id);
          return !allCategories.some((existing) => {
            const existingId = normalizeIdToString(existing._id);
            return existingId === catId;
          });
        }
      );
      subCategories.push(...newCategories);
      allCategories.push(...newCategories);

      const subTotal = subResponse?.data?.total || 0;
      subHasMore = subCategoriesList.length === limit && subCategories.length < subTotal;
      subPage++;
    }

    for (const subCategory of subCategories) {
      const subCategoryId = normalizeIdToString(subCategory._id);
      if (subCategoryId) {
        await fetchSubcategories(subCategoryId);
      }
    }
  };

  await fetchRootCategories();
  const rootCategories = [...allCategories];
  for (const rootCategory of rootCategories) {
    const rootCategoryId = normalizeIdToString(rootCategory._id);
    if (rootCategoryId) {
      await fetchSubcategories(rootCategoryId);
    }
  }

  return allCategories;
};

const PackageItemForm: React.FC<PackageItemFormProps> = ({
  open,
  onClose,
  packageItem,
  onSave,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedPackageOption, setSelectedPackageOption] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pendingUploadRef = useRef<{ resolve: (id: string) => void; reject: (error: Error) => void } | null>(null);

  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { uploadImage: uploadImageHook, isUploading: isUploadingHook } = usePostImage((imageData) => {
    if (imageData?._id) {
      setImageId(imageData._id);
      const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3008/v1';
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      let url = imageData.url || '';
      if (url.startsWith('uploads/')) {
        url = url.replace('uploads/', '');
      }
      if (url && !url.startsWith('http')) {
        setImagePreview(`${cleanBaseUrl}/uploads/${url}`);
      } else if (url) {
        setImagePreview(url);
      }
      if (pendingUploadRef.current) {
        if (uploadTimeoutRef.current) {
          clearTimeout(uploadTimeoutRef.current);
          uploadTimeoutRef.current = null;
        }
        pendingUploadRef.current.resolve(imageData._id);
        pendingUploadRef.current = null;
      }
    }
  });

  const isUploading = uploadingImage || isUploadingHook;

  const { control, handleSubmit, reset, setValue, watch, register } = useForm<{
    nameUz: string;
    nameRu: string;
    nameEn: string;
    price: number;
    isActive: boolean;
    imageId?: string;
  }>({
    defaultValues: {
      nameUz: '',
      nameRu: '',
      nameEn: '',
      price: 0,
      isActive: true,
      imageId: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      fetchAllCategories()
        .then((categoriesList) => {
          setCategories(categoriesList);
          setExpandedCategories(new Set());
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
          toast.error('Kategoriyalarni yuklashda xatolik');
        });
    }
  }, [open]);
  
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  useEffect(() => {
    if (open && packageItem) {
      reset({
        nameUz: packageItem.name?.uz || '',
        nameRu: packageItem.name?.ru || '',
        nameEn: packageItem.name?.en || '',
        price: packageItem.price || 0,
        isActive: packageItem.isActive !== undefined ? packageItem.isActive : true,
      });
      setSelectedCategories(packageItem.categoryIds?.map(id => String(id)) || []);
      setImageId(packageItem.imageId);
      if (packageItem.image) {
        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3008/v1';
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        let url: string;
        if (typeof packageItem.image === 'object' && packageItem.image?.url) {
          url = packageItem.image.url;
        } else if (typeof packageItem.image === 'string') {
          url = packageItem.image;
        } else {
          url = '';
        }
        if (url && url.startsWith('uploads/')) {
          url = url.replace('uploads/', '');
        }
        if (url && !url.startsWith('http')) {
          setImagePreview(`${cleanBaseUrl}/uploads/${url}`);
        } else if (url) {
          setImagePreview(url);
        }
        setSelectedPackageOption(null);
        setUploadedFile(null);
      } else {
        setImagePreview(null);
        setSelectedPackageOption(null);
        setUploadedFile(null);
      }
    } else if (open && !packageItem) {
      reset({
        nameUz: '',
        nameRu: '',
        nameEn: '',
        price: 0,
        isActive: true,
      });
      setSelectedCategories([]);
      setImageId(undefined);
      setImagePreview(null);
      setSelectedPackageOption(null);
      setUploadedFile(null);
    }
  }, [open, packageItem, reset]);

  const getAllSubCategoryIds = (category: any): string[] => {
    const ids: string[] = [];
    if (category.children && category.children.length > 0) {
      category.children.forEach((child: any) => {
        ids.push(String(child._id));
        ids.push(...getAllSubCategoryIds(child));
      });
    }
    return ids;
  };

  const handleCategoryToggle = (categoryId: string, category?: any) => {
    const normalizedId = String(categoryId);
    const isSelected = selectedCategories.includes(normalizedId);
    
    let newSelected: string[];
    if (isSelected) {
      newSelected = selectedCategories.filter(id => id !== normalizedId);
      if (category && category.children && category.children.length > 0) {
        const subCategoryIds = getAllSubCategoryIds(category);
        newSelected = newSelected.filter(id => !subCategoryIds.includes(id));
      }
    } else {
      newSelected = [...selectedCategories, normalizedId];
      if (category && category.children && category.children.length > 0) {
        const subCategoryIds = getAllSubCategoryIds(category);
        subCategoryIds.forEach(subId => {
          if (!newSelected.includes(subId)) {
            newSelected.push(subId);
          }
        });
      }
    }
    
    setSelectedCategories(newSelected);
  };

  const handleSelectAll = () => {
    const getAllIds = (nodes: any[]): string[] => {
      const ids: string[] = [];
      nodes.forEach(node => {
        ids.push(String(node._id));
        if (node.children && node.children.length > 0) {
          ids.push(...getAllIds(node.children));
        }
      });
      return ids;
    };
    
    const allCategoryIds = getAllIds(categoryTree);
    if (selectedCategories.length === allCategoryIds.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(allCategoryIds);
    }
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryItem = (category: any, level: number = 0) => {
    const categoryId = String(category._id);
    const isSelected = selectedCategories.includes(categoryId);
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(categoryId);
    
    const allSubCategoryIds = hasChildren ? getAllSubCategoryIds(category) : [];
    const allSubSelected = hasChildren && allSubCategoryIds.every(id => selectedCategories.includes(id));
    const someSubSelected = hasChildren && allSubCategoryIds.some(id => selectedCategories.includes(id));
    
    return (
      <Box key={categoryId} sx={{ mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: level * 2 }}>
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={() => toggleExpand(categoryId)}
              sx={{ p: 0.5, mr: 0.5 }}
            >
              {isExpanded ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          ) : (
            <Box sx={{ width: 32 }} />
          )}
          <Checkbox
            checked={isSelected || allSubSelected}
            indeterminate={someSubSelected && !allSubSelected && !isSelected}
            onChange={() => handleCategoryToggle(categoryId, category)}
            size="small"
          />
          <Typography
            variant="body2"
            onClick={() => handleCategoryToggle(categoryId, category)}
            sx={{ cursor: 'pointer', flex: 1, ml: 1 }}
          >
            {getCategoryDisplayName(category)}
          </Typography>
        </Box>
        {hasChildren && isExpanded && (
          <Box sx={{ pl: 2 }}>
            {category.children.map((child: any) => renderCategoryItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const getCategoryDisplayName = (category: any) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'uz';
    return category.name?.[currentLang] || category.name?.uz || category.name || 'Kategoriya';
  };

  type PackageOptionType = typeof PACKAGE_OPTIONS[number];

  const getPackageDisplayName = (packageOption: PackageOptionType) => {
    const currentLang = (localStorage.getItem('i18nextLng') || 'uz') as 'uz' | 'ru' | 'en';
    return packageOption.name?.[currentLang] || packageOption.name?.uz || packageOption.id;
  };

  const handlePackageOptionSelect = (packageOption: PackageOptionType) => {
    if (isUploading) return;

    setSelectedPackageOption(packageOption.id);
    setUploadedFile(null);
    setImageId(undefined);
    setImagePreview(packageOption.image);
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Fayl hajmi 5MB dan katta');
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Noto\'g\'ri fayl formati');
      return;
    }

    setUploadingImage(true);
    setSelectedPackageOption(null);
    setUploadedFile(file);

    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      const resizedFile = await resizeImage(file, 800, 800);
      uploadImageHook({
        imageFile: resizedFile,
        id: 'uploaded-file',
      });
      
      toast.success('Rasm yuklandi');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Rasmni yuklashda xatolik yuz berdi');
      setImagePreview(null);
      setUploadedFile(null);
      setUploadingImage(false);
    }
  }, [uploadImageHook]);

  const removeImage = () => {
    setImagePreview(null);
    setImageId(undefined);
    setSelectedPackageOption(null);
    setUploadedFile(null);
  };

  const uploadPackageOptionImage = async (packageOption: PackageOptionType): Promise<string> => {
    return new Promise((resolve, reject) => {
      pendingUploadRef.current = { resolve, reject };
      
      uploadTimeoutRef.current = setTimeout(() => {
        if (pendingUploadRef.current) {
          pendingUploadRef.current = null;
          reject(new Error('Upload timeout'));
        }
      }, 30000);

      fetch(packageOption.image)
        .then(response => response.blob())
        .then(blob => {
          const fileName = packageOption.image.split('/').pop() || 'image';
          const file = new File([blob], fileName, { type: blob.type });
          return resizeImage(file, 800, 800);
        })
        .then(resizedFile => {
          uploadImageHook({
            imageFile: resizedFile,
            id: 'package-option',
          });
        })
        .catch(error => {
          if (uploadTimeoutRef.current) {
            clearTimeout(uploadTimeoutRef.current);
            uploadTimeoutRef.current = null;
          }
          pendingUploadRef.current = null;
          reject(error);
        });
    });
  };

  const onSubmit = async (data: any) => {
    if (!imageId && !selectedPackageOption && !uploadedFile) {
      toast.error('Rasm tanlash yoki yuklash majburiy');
      return;
    }

    setIsSubmitting(true);
    setUploadingImage(true);

    try {
      let finalImageId = imageId;

      if (selectedPackageOption && !imageId) {
        const packageOption = PACKAGE_OPTIONS.find(opt => opt.id === selectedPackageOption);
        if (packageOption) {
          try {
            finalImageId = await uploadPackageOptionImage(packageOption);
          } catch (error) {
            console.error('Error uploading package option image:', error);
            toast.error('Rasmni yuklashda xatolik yuz berdi');
            setUploadingImage(false);
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (!finalImageId) {
        toast.error('Rasm yuklashda xatolik yuz berdi');
        setUploadingImage(false);
        setIsSubmitting(false);
        return;
      }

      const packageItemData: PackageItem = {
        ...(packageItem?._id && { _id: packageItem._id }),
        name: {
          uz: data.nameUz,
          ru: data.nameRu,
          en: data.nameEn,
        },
        price: Number(data.price) || 0,
        categoryIds: selectedCategories,
        imageId: finalImageId,
        isActive: data.isActive,
      };
      await onSave(packageItemData);
      toast.success('Qo\'shimcha item saqlandi');
      onClose();
    } catch (error) {
      console.error('Error saving package item:', error);
      toast.error('Ma\'lumotlarni saqlashda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {packageItem ? 'Qo\'shimcha itemni tahrirlash' : 'Yangi qo\'shimcha item qo\'shish'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom (O'zbekcha)"
                {...register('nameUz', { required: 'O\'zbekcha nom majburiy' })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom (Ruscha)"
                {...register('nameRu', { required: 'Ruscha nom majburiy' })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom (Inglizcha)"
                {...register('nameEn', { required: 'Inglizcha nom majburiy' })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Narx (so'm)"
                {...register('price', {
                  required: 'Narx majburiy',
                  min: { value: 0, message: 'Narx 0 dan katta yoki teng bo\'lishi kerak' },
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Kategoriyalar</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAll}
                  >
                    {selectedCategories.length === categories.length ? 'Barchasini bekor qilish' : 'Barchasini tanlash'}
                  </Button>
                </Box>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {categoryTree.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                      Kategoriyalar topilmadi
                    </Typography>
                  ) : (
                    categoryTree.map((category) => renderCategoryItem(category))
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Agar kategoriya tanlanmagan bo'lsa, barcha kategoriyalar uchun qo'shiladi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rasm <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Grid container spacing={2}>
                {PACKAGE_OPTIONS.map((packageOption) => {
                  const isSelected = selectedPackageOption === packageOption.id && !uploadedFile;
                  return (
                    <Grid item xs={6} sm={3} key={packageOption.id}>
                      <Card
                        sx={{
                          cursor: isUploading ? 'not-allowed' : 'pointer',
                          border: isSelected ? 2 : 1,
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          position: 'relative',
                          opacity: isUploading ? 0.5 : 1,
                          '&:hover': {
                            transform: isUploading ? 'none' : 'scale(1.05)',
                            transition: 'transform 0.2s',
                          },
                          boxShadow: isSelected ? 3 : 1,
                        }}
                        onClick={() => !isUploading && handlePackageOptionSelect(packageOption)}
                      >
                        <Box sx={{ position: 'relative', aspectRatio: '1' }}>
                          <CardMedia
                            component="img"
                            image={packageOption.image}
                            alt={getPackageDisplayName(packageOption)}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {isSelected && (
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'primary.main',
                                opacity: 0.2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CheckCircle
                                sx={{
                                  color: 'primary.main',
                                  bgcolor: 'background.paper',
                                  borderRadius: '50%',
                                  p: 0.5,
                                  fontSize: 30,
                                }}
                              />
                            </Box>
                          )}
                          {isUploading && selectedPackageOption === packageOption.id && (
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'background.paper',
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CircularProgress size={24} />
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              textAlign: 'center',
                              fontWeight: 'medium',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {getPackageDisplayName(packageOption)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
                <Grid item xs={6} sm={3}>
                  <Card
                    sx={{
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      border: uploadedFile ? 2 : 1,
                      borderStyle: uploadedFile ? 'solid' : 'dashed',
                      borderColor: uploadedFile ? 'primary.main' : 'divider',
                      position: 'relative',
                      opacity: isUploading ? 0.5 : 1,
                      '&:hover': {
                        transform: uploadingImage ? 'none' : 'scale(1.05)',
                        transition: 'transform 0.2s',
                      },
                      boxShadow: uploadedFile ? 3 : 1,
                    }}
                  >
                    {imagePreview && !selectedPackageOption ? (
                      <>
                        <Box sx={{ position: 'relative', aspectRatio: '1' }}>
                          <CardMedia
                            component="img"
                            image={imagePreview}
                            alt="Uploaded preview"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                            disabled={isUploading}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: 'error.contrastText',
                              '&:hover': { bgcolor: 'error.dark' },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              bgcolor: 'primary.main',
                              opacity: 0.2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircle
                              sx={{
                                color: 'primary.main',
                                bgcolor: 'background.paper',
                                borderRadius: '50%',
                                p: 0.5,
                                fontSize: 30,
                              }}
                            />
                          </Box>
                          {isUploading && (
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'background.paper',
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CircularProgress size={24} />
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              textAlign: 'center',
                              fontWeight: 'medium',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Yuklangan rasm
                          </Typography>
                        </CardContent>
                      </>
                    ) : (
                      <Box
                        component="label"
                        sx={{
                          position: 'relative',
                          aspectRatio: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isUploading ? 'not-allowed' : 'pointer',
                          p: 2,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingImage}
                        />
                        {isUploading && !selectedPackageOption ? (
                          <>
                            <CircularProgress size={32} sx={{ mb: 1 }} />
                            <Typography variant="caption" color="text.secondary" align="center">
                              Yuklanmoqda...
                            </Typography>
                          </>
                        ) : (
                          <>
                            <CloudUpload sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="caption" fontWeight="medium" align="center" sx={{ mb: 0.5 }}>
                              Rasm yuklash
                            </Typography>
                            <Typography variant="caption" color="text.secondary" align="center">
                              PNG, JPG, WEBP
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </Card>
                </Grid>
              </Grid>
              {!imageId && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Rasm tanlash yoki yuklash majburiy
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('isActive')}
                    defaultChecked={watch('isActive')}
                  />
                }
                label="Faol"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Package item faol bo'lsa, customer cart'ga avtomatik qo'shiladi
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Bekor qilish
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} /> : 'Saqlash'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PackageItemForm;

