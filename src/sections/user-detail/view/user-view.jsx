import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AutohideNoti from "src/components/notification/autohide";
import { Row, Col, Button, Card, Avatar, List, Input, Select } from "antd";
import { getUserInfor } from "src/api/account";
import { updateInfor } from "src/api/user";

// ------------------------------------------------------------------------

const { Option } = Select;

export default function UserView() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [change, setChange] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserInfor();
      setName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phonenumber);
      setAddress(response.data.address);
      setGender(response.data.gender == 1 ? 'Nam' : response.data.gender == 0 ? 'Nữ' : 'Khác');
    };
    fetchData();
  }, [change]);

  useEffect(() => {
    const address_2_saved = localStorage.getItem('address_2_saved');
    const district_saved = localStorage.getItem('district');

    if (address_2_saved) {
      $('select[name="calc_shipping_district"] option').each(function () {
        if ($(this).text() === address_2_saved) {
          $(this).attr('selected', '');
        }
      });
      $('input.billing_address_2').attr('value', address_2_saved);
    }

    if (district_saved) {
      $('select[name="calc_shipping_district"]').html(district_saved);
      $('select[name="calc_shipping_district"]').on('change', function () {
        const target = $(this).children('option:selected');
        target.attr('selected', '');
        $('select[name="calc_shipping_district"] option').not(target).removeAttr('selected');
        const address_2 = target.text();
        $('input.billing_address_2').attr('value', address_2);
        localStorage.setItem('district', $('select[name="calc_shipping_district"]').html());
        localStorage.setItem('address_2_saved', address_2);
      });
    }

    $('select[name="calc_shipping_provinces"]').each(function () {
      const $this = $(this);
      let stc = '';
      c.forEach((i, e) => {
        e += 1;
        stc += `<option value="${e}">${i}</option>`;
        $this.html(`<option value="">Tỉnh / Thành phố</option>${stc}`);
        const address_1_saved = localStorage.getItem('address_1_saved');
        if (address_1_saved) {
          $('select[name="calc_shipping_provinces"] option').each(function () {
            if ($(this).text() === address_1_saved) {
              $(this).attr('selected', '');
            }
          });
          $('input.billing_address_1').attr('value', address_1_saved);
        }
        $this.on('change', function (i) {
          i = $this.children('option:selected').index() - 1;
          let str = '';
          const r = $this.val();
          if (r !== '') {
            arr[i].forEach((el) => {
              str += `<option value="${el}">${el}</option>`;
              $('select[name="calc_shipping_district"]').html(`<option value="">Quận / Huyện</option>${str}`);
            });
            const address_1 = $this.children('option:selected').text();
            const district = $('select[name="calc_shipping_district"]').html();
            localStorage.setItem('address_1_saved', address_1);
            localStorage.setItem('district', district);
            $('select[name="calc_shipping_district"]').on('change', function () {
              const target = $(this).children('option:selected');
              target.attr('selected', '');
              $('select[name="calc_shipping_district"] option').not(target).removeAttr('selected');
              const address_2 = target.text();
              $('input.billing_address_2').attr('value', address_2);
              localStorage.setItem('district', $('select[name="calc_shipping_district"]').html());
              localStorage.setItem('address_2_saved', address_2);
            });
          } else {
            $('select[name="calc_shipping_district"]').html('<option value="">Quận / Huyện</option>');
            localStorage.setItem('district', $('select[name="calc_shipping_district"]').html());
            localStorage.removeItem('address_1_saved');
          }
        });
      });
    });
  }, []);

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const labelStyle = {
    width: '150px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    flex: '1'
  };

  const handleSaveInfor = async () => {
    if (isEditing) {
      if (!name || !email || !phone || !province || !district || !ward) {
        setError('Vui lòng điền đầy đủ tất cả các trường.');
        return;
      } else {
        setError('');
      }
      const formData = {
        name,
        email,
        phonenumber: phone,
        address: ward + ', ' + district + ', ' + province,
        gender: parseInt(gender)
      };
      const result = await updateInfor(formData);
      setChange(!change);
      setSnackbarMessage(result.data.message);
      setSnackbarOpen(true);
    }
    handleAddress();
    setIsEditing(!isEditing);
  };

  const handleAddress = () => {
    if (!address) return;
    const add = address.split(', ');
    setProvince(add[2]);
    setDistrict(add[1]);
    setWard(add[0]);
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Xin chào {name} ✌️✌️✌️!!!</Typography>
      </Stack>

      <Stack>
        <Card title="Trang cá nhân" style={{ fontWeight: 'bold' }}>
          <Row>
            <Col span={6}>
              <Avatar size={128} src="assets/images/avatars/avatar_2.jpg" />
            </Col>
            <Col span={18}>
              <Button onClick={handleSaveInfor} style={{ marginBottom: '20px' }}>
                {isEditing ? 'Lưu' : 'Chỉnh sửa'}
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              <List>
                <List.Item style={itemStyle}>
                  <span style={labelStyle}>Họ và tên</span>
                  {isEditing ? (
                    <Input required style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  ) : (
                    <span>{name}</span>
                  )}
                </List.Item>

                <List.Item style={itemStyle}>
                  <span style={labelStyle}>Email</span>
                  {isEditing ? (
                    <Input disabled style={inputStyle} type="email" value={email} />
                  ) : (
                    <span>{email}</span>
                  )}
                </List.Item>

                <List.Item style={itemStyle}>
                  <span style={labelStyle}>Số điện thoại</span>
                  {isEditing ? (
                    <Input required style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  ) : (
                    <span>{phone}</span>
                  )}
                </List.Item>

                <List.Item style={itemStyle}>
                  {isEditing ? (
                    <>
                      <span style={labelStyle}>Tỉnh / Thành phố</span>
                      <Select required name="calc_shipping_provinces" style={inputStyle} value={province} onChange={setProvince}>
                        <Option value="">Tỉnh / Thành phố</Option>
                        {c.map((province, index) => (
                          <Option key={index} value={province}>
                            {province}
                          </Option>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <span style={labelStyle}>Địa chỉ</span>
                      <span>{address}</span>
                    </>
                  )}
                </List.Item>
                
                { isEditing ? (
                  <List.Item style={itemStyle}>
                    <span style={labelStyle}>Quận/Huyện</span>
                    <Select required name="calc_shipping_district" style={inputStyle} value={district} onChange={setDistrict}>
                      <Option value="">Quận / Huyện</Option>
                      {arr[c.indexOf(province)]?.map((district, index) => (
                        <Option key={index} value={district}>
                          {district}
                        </Option>
                      ))}
                    </Select>
                  </List.Item>
                ) : null}

                { isEditing ? (
                  <List.Item style={itemStyle}>
                    <span style={labelStyle}>Xã/Phường</span>
                    <Input required style={inputStyle} type="text" value={ward} onChange={(e) => setWard(e.target.value)}/>
                  </List.Item>
                ) : null}

                <List.Item style={itemStyle}>
                  <span style={labelStyle}>Giới tính</span>
                  {isEditing ? (
                    <Select required style={inputStyle} value={gender} onChange={(value) => setGender(value)}>
                      <Option value={1}>Nam</Option>
                      <Option value={0}>Nữ</Option>
                      <Option value={2}>Khác</Option>
                    </Select>
                  ) : (
                    <span>{gender}</span>
                  )}
                </List.Item>
              </List>
            </Col>
          </Row>
        </Card>
      </Stack>

      <AutohideNoti message={snackbarMessage} open={snackbarOpen} onClose={handleCloseSnackbar} />
    </Container>
  );
}