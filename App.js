import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

Notifications.createCategoryAsync("A_OR_B", [
  {
    actionId: "a",
    buttonTitle: "A"
  },
  {
    actionId: "b",
    buttonTitle: "B"
  }
]);

export default class App extends React.Component {
  state = {
    token: null,
    notification: null
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log({ token });
      this.setState({ token });
    } catch (err) {
      // couldn't get the token
    }
  };

  componentDidMount() {
    // Get the Expo push token
    this.registerForPushNotificationsAsync();
    // Add a listener
    Notifications.addListener(notification => {
      this.setState({ notification });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Push Token</Text>
        <Text style={styles.paragraph}>{this.state.token}</Text>
        <Text style={styles.heading}>Latest Notification</Text>
        <Text style={styles.paragraph}>
          {JSON.stringify(this.state.notification)}
        </Text>
        <Text style={styles.heading}>actionId</Text>
        <Text style={styles.paragraph}>
          {this.state.notification ? this.state.notification.actionId : null}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  paragraph: {
    margin: 10,
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "center"
  },
  heading: {
    margin: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
