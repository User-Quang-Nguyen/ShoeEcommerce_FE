import React, {useEffect, useState} from "react";
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { InputNumber } from "antd";

import {useSearchParams} from "react-router-dom";
import {productDetail} from "src/api/products";
import { addToCart } from "src/api/cart";
import AutohideNoti from "src/components/notification/autohide";

import 'src/global.css';

// ------------------------------------------------------------------------

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const [infor, setInfor] = useState();
  const [selectedColor, setSelectedColor] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quan, setQuan] = useState();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      const result = await productDetail(productId);
      setInfor(result.data);
    };

    fetchData();
  }, []);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const sizes = infor
      .detail
      .filter((detail) => detail.color === color)
      .map((detail) => detail.size);
    setAvailableSizes(sizes);
    setSelectedSize('');
  };

  const findById = async () => {
    const detail = infor.detail;
    let prdi = 1;
    await detail?.map((item) => {
      if (item.color === selectedColor && item.size === selectedSize) {
        prdi = item.id;
        setQuan(item.quantity);
      }
    });
    return prdi;
  }

  const handleSizeSelect = async (size) => {
    setSelectedSize(size);
    await findById();
  };

  const addTo_Cart = async () => {
    if(quan == 0){
      setSnackbarMessage("Xin lỗi này sản phẩm đã hết hàng");
      setSnackbarOpen(true);
      return;
    }
    if(quantity > quan){
      setSnackbarMessage("Số lượng không được lớn hơn "+quan);
      setSnackbarOpen(true);
      return;
    }
    const prdi = await findById();
    const formData = {
      shoeid: prdi,
      quantity: quantity
    }
    const result = await addToCart(formData);
    if (result.data.status === true) {
      setSnackbarMessage(result.data.message);
      setSnackbarOpen(true);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if(quan == 0){
      setSnackbarMessage("Xin lỗi sản phẩm đã hết hàng");
      setSnackbarOpen(true);
      return;
    }
    if(quantity >= quan ){
      setSnackbarMessage("Số lượng không được lớn hơn "+quan);
      setSnackbarOpen(true);
    }else{
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleQuantityChange = (event) => {
    if (event.target.value > 0) {
      setQuantity(event.target.value);
    }else{
      setSnackbarMessage("Số lượng phải lớn hơn 0");
      setSnackbarOpen(true);
    }
  };

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark'
      ? '#1A2027'
      : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  }));

  const getColorButtonStyle = (color) => ({
    backgroundColor: color === 'White'
      ? 'Gray'
      : color,
    color: 'White',
    margin: '4px'
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{
        mb: 5
      }}>
        Chi tiết sản phẩm
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={6} md={5}>
          <Item>
            <img
              src= {infor?.image}
              alt=""
              className="fixed-size-image"/>
          </Item>
        </Grid>
        <Grid xs={6} md={7}>
          <Grid item xs={12} sm={6}>
            <Item>
              <p>
                Một sản phẩm đến từ thương hiệu {infor?.brandname} có tên {infor?.name} được mọi người tin dùng. Chất liệu cao cấp được lựa chọn kỹ lưỡng mang đến sự mềm mại, thoáng khí, đảm bảo đôi chân bạn luôn được nâng niu và bảo vệ tối ưu. {infor?.name} không chỉ là một đôi giày mà còn là sự khẳng định cá tính của bạn.
              </p>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Item>
              <h3>Thể loại:</h3> {infor
                ?.category.join(', ')}
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Item>
              <h3>Giá:</h3> {infor
                ?.price} $
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
            {console.log(infor)}
            <Item>{infor && infor.detail.length != 0 ? (
                <div>
                  <h3>Màu:</h3>
                  {infor
                    .detail
                    .reduce((uniqueColors, detail) => {
                      if (!uniqueColors.includes(detail.color)) {
                        uniqueColors.push(detail.color);
                      }
                      return uniqueColors;
                    }, [])
                    .map((color) => (
                      <Button
                        key={color}
                        style={getColorButtonStyle(color)}
                        onClick={() => handleColorSelect(color)}>
                        {color}
                      </Button>
                    ))}
                </div>
              ) : (
                <p style={{ color: 'red' }}>Chưa có sản phẩm cụ thể</p>
              )
              }
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Item>
              {selectedColor && (
                <div>
                  <h3>Kích thước:</h3>
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant="outlined"
                      onClick={() => handleSizeSelect(size)}
                      sx={{
                      mr: 1,
                      mb: 1
                    }}>
                      {size}
                    </Button>
                  ))}
                </div>
              )}
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Item>
              {selectedSize && quan != null && (
                <div>
                  <h3>Số lượng:</h3>
                  <div
                    style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Button onClick={handleDecreaseQuantity} sx={{ fontSize: '1.5rem' }}>-</Button>
                    <TextField
                      disabled
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      InputProps={{
                      inputProps: {
                        min: 1
                      }
                    }}
                      sx={{
                      mx: 2,
                      width: '50px',
                    }}/>
                      <Button sx={{ fontSize: '1.5rem' }} onClick={handleIncreaseQuantity}>+</Button>
                      <p>Số lượng trong kho: {quan}</p>
                  </div>
                  <Button
                    onClick={addTo_Cart}
                    sx={{ mt: 2, mx: 'auto', display: 'block' }}
                    variant="contained">Thêm vào giỏ</Button>
                </div>
              )}
            </Item>
          </Grid>
        </Grid>
      </Grid>
      <AutohideNoti message={snackbarMessage} open={snackbarOpen} onClose={handleCloseSnackbar} />
    </Container>
  )
}