import { Redirect } from "expo-router";
import Welcome from "./(auth)/welcome";
const Home = () => {
    return <Redirect href={"/(auth)/welcome"} />;
};

export default Home;