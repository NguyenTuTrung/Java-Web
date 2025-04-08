import React, { useState } from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}


function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface ProductInfoProps {
  productDescription: string | undefined;
  reviews: string;
  returnPolicy: string;
  warrantyPolicy: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productDescription,
  reviews,
  returnPolicy,
  warrantyPolicy,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Thông tin sản phẩm">
        <Tab label="Mô tả" />
        <Tab label="Đánh giá" />
        <Tab label="Chính sách đổi trả" />
        <Tab label="Chính sách bảo hành" />
      </Tabs>

        <TabPanel value={tabIndex} index={0}>
            <div dangerouslySetInnerHTML={{ __html: productDescription }} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
            {reviews}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        {returnPolicy}
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        {warrantyPolicy}
      </TabPanel>
    </div>
  );
};

export default ProductInfo;