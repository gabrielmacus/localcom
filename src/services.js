

export function User(data)
{
  if(data)
  {
    localStorage.setItem('user', JSON.stringify(data));
  }
  else if(data === false)
  {
    localStorage.removeItem('user')
  }
  else
  {
    let storageData = localStorage.getItem('user')
    return storageData ? JSON.parse(storageData) : null
  }
}
