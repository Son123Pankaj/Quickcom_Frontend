import axios from 'axios';

const serverURL = 'https://quickcom-backend-z27h.vercel.app';

const currentDate = () => {
  const d = new Date();

  const cd =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate();

  const ct =
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds();

  return cd + ' ' + ct;
};

const createDate = (date) => {
  const d = new Date(date);

  const cd =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate();

  const ct =
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds();

  return cd + ' ' + ct;
};

const postData = async (url, body) => {
  try {
    console.log('POST URL:', `${serverURL}/${url}`);
    console.log('POST BODY:', body);

    const response = await axios.post(
      `${serverURL}/${url}`,
      body
    );

    console.log('POST RESPONSE:', response.data);

    return response.data;
  } catch (e) {
    console.error('POST ERROR:', e);

    return {
      success: false,
      message: e.response?.data?.message || e.message,
      status: e.response?.status
    };
  }
};

const getData = async (url) => {
  try {
    console.log('GET URL:', `${serverURL}/${url}`);

    const response = await axios.get(
      `${serverURL}/${url}`
    );

    console.log('GET RESPONSE:', response.data);

    return response.data;
  } catch (e) {
    console.error('GET ERROR:', e);

    return {
      success: false,
      message: e.response?.data?.message || e.message,
      status: e.response?.status
    };
  }
};

export {
  postData,
  serverURL,
  currentDate,
  getData,
  createDate
};