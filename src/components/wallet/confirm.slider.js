import React, { Component } from 'react';
import {
  View, PanResponder, Animated, NativeModules,
} from 'react-native';
import PropTypes from 'prop-types';

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class ConfirmSlider extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    const { buttonSize } = this.props;

    this.state = {
      drag: new Animated.ValueXY(),
      buttonOpacity: new Animated.Value(1),
      progressWidth: new Animated.Value(buttonSize),
      animatedTextValue: new Animated.Value(0),
      confirm: false,
      percent: 0,
      dimensions: { width: 0, height: 0 },
    };

    const { drag, progressWidth, animatedTextValue } = this.state;
    this.panResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // eslint-disable-next-line no-underscore-dangle
        const positionXY = drag.__getValue();
        drag.setOffset(positionXY);
        drag.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: drag.x }], {
        // limit sliding out of box
        listener: (event, gestureState) => {
          const {
            confirm,
            dimensions: { width },
          } = this.state;
          const maxMoving = width - buttonSize;

          let toX = gestureState.dx;

          if (toX < 0) toX = 0;
          if (toX > maxMoving) toX = maxMoving;
          const percent = Math.round(((toX * 100) / maxMoving).toFixed());
          this.setState({ percent });

          if (confirm) {
            drag.setValue({ x: 0, y: 0 });
            return;
          }
          animatedTextValue.setValue(percent);
          progressWidth.setValue(buttonSize + toX);
          drag.setValue({ x: toX, y: 0 });
        },
      }),
      onPanResponderRelease: () => {
        const { onVerified, okButton } = this.props;
        const { confirm, percent } = this.state;
        if (confirm) return;
        if (percent >= 100) {
          this.setState({ confirm: true });
          onVerified(); // communicate that the verification was successful

          const { visible, duration } = okButton;
          if (!visible) {
            this.toggleShowAnimation(false, duration);
          }
        } else if (!confirm) {
          this.reset();
        }
      },
      onPanResponderTerminate: () => {
      },
    });
  }

  reset() {
    const { drag, progressWidth, animatedTextValue } = this.state;
    const { okButton, buttonSize } = this.props;
    drag.setOffset({ x: 0, y: 0 });

    Animated.parallel([
      Animated.timing(drag, {
        toValue: { x: 0, y: 0 },
        duration: 800,
      }),
      Animated.timing(progressWidth, {
        toValue: buttonSize,
        duration: 800,
      }),
      Animated.timing(animatedTextValue, {
        toValue: 0,
        duration: 800,
      }),
    ]).start();

    this.toggleShowAnimation(true, okButton.duration);
    this.toggleShowAnimation(true, okButton.duration);
    this.setState({ confirm: false, percent: 0 });
  }

  toggleShowAnimation(visible, duration) {
    const { buttonOpacity } = this.state;
    Animated.timing(
      buttonOpacity, // The animated value to drive
      {
        toValue: visible ? 1 : 0, // Animate to opacity: 1 (opaque)
        duration, // Make it take a while
      },
    ).start();
  }

  render() {
    const {
      buttonColor,
      buttonSize,
      borderColor,
      backgroundColor,
      // icon,
      borderRadius,
      label,
    } = this.props;
    const {
      buttonOpacity, drag, progressWidth, dimensions, animatedTextValue,
    } = this.state;
    const position = { transform: drag.getTranslateTransform() };

    return (
      <View style={{
        borderColor,
        borderWidth: 2,
        borderRadius: borderRadius + 4,
        padding: 2,
        flex: 1,
        height: buttonSize + 8,
      }}
      >
        <View
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            this.setState({
              dimensions: { width, height },
            });
          }}
          style={{
            backgroundColor,
            height: buttonSize,
            borderRadius,
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Animated.View style={[{
            position: 'absolute', height: dimensions.height, width: progressWidth, backgroundColor: '#7BCC70', borderRadius,
          }]}
          />

          {label && (
          <View style={[{ position: 'absolute', alignSelf: 'center' }]}>
            <Animated.Text style={[{
              fontWeight: 'bold',
              fontSize: 15,
              color: animatedTextValue.interpolate(
                {
                  inputRange: [0, 100],
                  outputRange: ['black', 'white'],
                },
              ),
            }]}
            >
              {label}
            </Animated.Text>
          </View>
          )}

          <Animated.View
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.panResponder.panHandlers}
            style={[position, {
              width: buttonSize,
              height: buttonSize,
              borderRadius,
              backgroundColor: buttonColor,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: buttonOpacity,
            },
            ]}
          >
            {/* {icon} */}
          </Animated.View>
        </View>
      </View>
    );
  }
}

ConfirmSlider.propTypes = {
  buttonColor: PropTypes.string.isRequired,
  buttonSize: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  icon: PropTypes.shape({}).isRequired,
  borderRadius: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
  okButton: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ConfirmSlider;

// e.g
//
// <ConfirmSlider
//     ref={(ref) => this.confirmSlider = ref}
//     width={screen.width - 50}
//     buttonSize={30}
//     buttonColor="#2962FF"
//     borderColor="#2962FF"
//     backgroundColor="#fff"
//     textColor="#37474F"
//     borderRadius={15}
//     okButton={{ visible: true, duration: 400 }}
//     onVerified={() => {
//         this.setState({ isConfirm: true });
//     }}
//     icon={(
//         <Image
//             source={isConfirm ? circleCheckIcon : circleIcon}
//             style={{ width: 20, height: 20 }}
//         />
//     )}
// >
//     <Text>{isConfirm ? 'CONFIRMED' : 'slide to confirm'}</Text>
// </ConfirmSlider>
