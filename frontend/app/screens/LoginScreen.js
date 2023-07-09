import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import Constants from "expo-constants";

import colours from "../config/colours.js";
import LoadingContext from "../store/LoadingContext.js";
import StyledButton from "../components/StyledButton.js";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

function LoginScreen({ navigation }) {
    const { setIsLoading } = useContext(LoadingContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let handleLogin = async (evt) => {
        evt.preventDefault();
    
        setIsLoading(true);
    
        try {
            const auth = getAuth();

            await signInWithEmailAndPassword(auth, "apex@gmail.com", "Supersecret1");
			// await signInWithEmailAndPassword(auth, email, password);
    
            const idToken = await auth.currentUser.getIdToken();

            const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json", token: idToken },
            });
            const data = await response.json();

            if (data.status === "ERROR") {
              setIsLoading(false);
              Alert.alert("Error", "Invalid email or password");
              return;
            }

            setIsLoading(false);
            navigation.navigate("Dashboard");
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Error", "Invalid email or password");
        }
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Login</Text>
            </View>
            <Image
                style={styles.image}
                source={require("../assets/fuxiIcon.png")}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    secureTextEntry={false}
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.clickableText}>Sign up</Text>
            </TouchableOpacity>
            <StyledButton text="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.bg,
  },
  titleContainer: {
    borderBottomWidth: 2,
    borderBottomColor: colours.primary,
    marginBottom: 30,
  },
  titleText: {
    fontSize: 32,
    color: colours.primaryText,
    paddingBottom: 10,
    fontWeight: "500",
  },
  image: {
    height: 100,
    aspectRatio: 1,
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: colours.secondary,
    borderRadius: 30,
    width: Platform.OS === "web" ? "30%" : "70%",
    height: 50,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    marginLeft: 20,
    color: colours.primaryText,
  },
  clickableText: {
    height: 30,
    color: colours.primary,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  passwordToggle: {
    marginRight: 10,
  },
});

export default LoginScreen;
