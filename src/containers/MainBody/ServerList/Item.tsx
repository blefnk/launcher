import { useContext, useEffect, useRef, memo } from "react";
import { StyleSheet, View, Pressable, Animated } from "react-native";
import { Server } from "../../../utils/types";
import Icon from "../../../components/Icon";
import { images } from "../../../constants/images";
import Text from "../../../components/Text";
import { ThemeContext } from "../../../contexts/theme";

interface IProps {
  server: Server;
  index: number;
  isSelected?: boolean;
  onSelect?: (server: Server) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ServerItem = memo((props: IProps) => {
  const { server, index } = props;

  const { theme } = useContext(ThemeContext);
  const isSelectedRef = useRef(!!props.isSelected);

  useEffect(() => {
    if (props.isSelected) {
      fadeAnimValue.setValue(1);
      isSelectedRef.current = true;
    } else {
      fadeAnimValue.setValue(0.8);
      isSelectedRef.current = false;
    }
  }, [props.isSelected]);

  const fadeAnimValue = useRef(new Animated.Value(0.8)).current;

  const fadeInAnim = Animated.timing(fadeAnimValue, {
    toValue: 1,
    duration: 100,
    useNativeDriver: false,
  });

  const fadeOutAnim = Animated.timing(fadeAnimValue, {
    toValue: 0.8,
    duration: 400,
    useNativeDriver: false,
  });

  const fadeOut = () => {
    if (!isSelectedRef.current) fadeOutAnim.start();
  };

  const fadeIn = () => {
    if (!isSelectedRef.current) fadeInAnim.start();
  };

  return (
    <AnimatedPressable
      key={"server-item-" + index}
      style={[
        styles.pressableContainer,
        {
          opacity: fadeAnimValue,
        },
      ]}
      onHoverIn={() => !props.isSelected && fadeIn()}
      onHoverOut={() => !props.isSelected && fadeOut()}
      onPress={() => {
        if (props.onSelect) {
          props.onSelect(props.server);
        }
      }}
    >
      <View
        style={[
          styles.serverContainer,
          {
            borderWidth: props.isSelected ? 0 : 0,
            backgroundColor: props.isSelected
              ? theme.selectedItemBackgroundColor
              : theme.responsiveListItemBackgroundColor,
            borderColor: theme.selectedItemBorderColor,
            borderRadius: props.isSelected ? 4 : 0,
            top: props.isSelected ? 0 : 0,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            server.hasPassword
              ? { backgroundColor: "#DA0000BB" }
              : { backgroundColor: "#24731DBB" },
          ]}
        >
          <Icon
            image={
              server.hasPassword ? images.icons.locked : images.icons.unlocked
            }
            size={17}
          />
        </View>
        {server.usingOmp && (
          <View style={[styles.iconContainer]}>
            <Icon image={images.icons.ompLight} size={20} />
          </View>
        )}
        <View style={[styles.commonFieldContainer, styles.hostNameContainer]}>
          <Text size={1} color={theme.textPrimary}>
            {server.hostname}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            minWidth: 300,
            flexDirection: "row",
            marginLeft: server.usingOmp ? -26 : 0,
          }}
        >
          <View
            style={[styles.commonFieldContainer, styles.pingFieldContainer]}
          >
            <Text size={1} color={theme.textPrimary + "AA"}>
              {server.ping}
            </Text>
          </View>
          <View style={[styles.commonFieldContainer, styles.gameModeContainer]}>
            <Text size={1} color={theme.textPrimary}>
              {server.gameMode}
            </Text>
          </View>
          <View
            style={[styles.commonFieldContainer, styles.playersFieldContainer]}
          >
            <Text size={1} color={theme.textPrimary}>
              {server.playerCount}
              <Text size={1} color={theme.textPrimary + "AA"}>
                /{server.maxPlayers}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  pressableContainer: {
    // @ts-ignore
    cursor: "default",
  },
  serverContainer: {
    height: 25,
    width: "100%",
    flexDirection: "row",
  },
  iconContainer: {
    height: 25,
    width: 24,
    marginLeft: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commonFieldContainer: {
    justifyContent: "center",
  },
  hostNameContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  playersFieldContainer: {
    paddingRight: 5,
    width: 80,
    alignItems: "flex-end",
  },
  pingFieldContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  gameModeContainer: {
    flex: 1,
    maxWidth: 450,
    minWidth: 170,
    paddingLeft: 10,
  },
});

export default ServerItem;