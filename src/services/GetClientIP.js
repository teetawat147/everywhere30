const getIP = async () => {
  const response = await fetch('https://api.ipify.org/?format=json');
  const data = await response.json();
  // console.log(data);
  return data;
}

export default getIP;
