declare module 'react-native-custom-actionsheet' {
    import { Component } from 'react';
    import { ViewStyle, TextStyle } from 'react-native';
  
    interface ActionSheetProps {
      options: string[];
      cancelButtonIndex?: number;
      destructiveButtonIndex?: number;
      title?: string;
      message?: string;
      tintColor?: string;
      textStyle?: TextStyle;
      titleTextStyle?: TextStyle;
      messageTextStyle?: TextStyle;
      separatorStyle?: ViewStyle;
      containerStyle?: ViewStyle;
      buttonUnderlayColor?: string;
      showSeparators?: boolean;
      showSparatorBetweenTitleAndButtons?: boolean;
      showCancelButton?: boolean;
      showTitle?: boolean;
      showTitleInCenter?: boolean;
      showMessage?: boolean;
      useNativeDriver?: boolean;
      onAnimationDone?: () => void;
      onDismiss?: () => void;
      onPress?: (index: number) => void;
    }
  
    class ActionSheet extends Component<ActionSheetProps> {}
  
    export default ActionSheet;
  }
  