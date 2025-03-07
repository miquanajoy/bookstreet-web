export default function HandleEventViewmodel(props) {
  const userValue = JSON.parse(localStorage.getItem("userInfo"));
  const isDisableLocation = () => {
    const locations = props.locations
    return userValue.user.id
  };
  return { isDisableLocation };
}
