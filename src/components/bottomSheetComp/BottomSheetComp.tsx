import {
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useRef,
  ReactNode,
} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import colors from '../../config/colors';

export interface BottomSheetComponentRef {
  open: () => void;
  close: () => void;
  dismiss: () => void;
  snapToIndex: (index: number) => void;
  snapToPosition: (position: string | number) => void;
  expand: () => void;
  collapse: () => void;
}

interface Props {
  children: ReactNode;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  enableDismissOnClose?: boolean;
  enableDynamicSizing?: boolean;
  onChange?: (index: number) => void;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  showHandleIndicator?: boolean;
  showBackdrop?: boolean;
  backdropOpacity?: number;
  backdropColor?: string;
  keyboardBehavior?: 'interactive' | 'fillParent' | 'extend';
  keyboardBlurBehavior?: 'none' | 'restore';
  android_keyboardInputMode?: 'adjustResize' | 'adjustPan';
}

const BottomSheetComp = forwardRef<BottomSheetComponentRef, Props>(
  (
    {
      children,
      snapPoints,
      enablePanDownToClose = true,
      enableDismissOnClose = true,
      enableDynamicSizing = true,
      onChange,
      onAnimate,
      backgroundStyle,
      handleIndicatorStyle,
      containerStyle,
      showHandleIndicator = true,
      showBackdrop = true,
      backdropOpacity = 0.5,
      backdropColor = colors.black,
      keyboardBehavior = 'interactive',
      keyboardBlurBehavior = 'none',
      android_keyboardInputMode = 'adjustResize',
    },
    ref,
  ) => {
    // BottomSheetModal ref - using any to avoid type conflicts with library internals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bottomSheetModalRef = useRef<any>(null);

    // Imperative methods exposed to parent
    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetModalRef.current?.present();
      },
      close: () => {
        bottomSheetModalRef.current?.close();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      snapToIndex: (index: number) => {
        bottomSheetModalRef.current?.snapToIndex(index);
      },
      snapToPosition: (position: string | number) => {
        bottomSheetModalRef.current?.snapToPosition(position);
      },
      expand: () => {
        bottomSheetModalRef.current?.expand();
      },
      collapse: () => {
        bottomSheetModalRef.current?.collapse();
      },
    }));

    // Use dynamic sizing if enabled, otherwise use provided snapPoints
    const memoSnapPoints = useMemo(() => {
      if (enableDynamicSizing) {
        return undefined; // Dynamic sizing doesn't need snapPoints
      }
      return snapPoints || ['25%', '50%', '90%'];
    }, [snapPoints, enableDynamicSizing]);

    const handleChange = useCallback(
      (index: number) => {
        onChange?.(index);
      },
      [onChange],
    );

    const handleAnimate = useCallback(
      (fromIndex: number, toIndex: number) => {
        onAnimate?.(fromIndex, toIndex);
      },
      [onAnimate],
    );

    // Backdrop component
    const renderBackdrop = useCallback(
      (props: any) => {
        if (!showBackdrop) return null;
        return (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={backdropOpacity}
            pressBehavior="close"
            style={[styles.backdrop, { backgroundColor: backdropColor }]}
          />
        );
      },
      [showBackdrop, backdropOpacity, backdropColor],
    );

    const defaultBackgroundStyle = useMemo(
      () => [styles.defaultBackground, backgroundStyle],
      [backgroundStyle],
    );

    const defaultHandleIndicatorStyle = useMemo(
      () => [styles.defaultHandleIndicator, handleIndicatorStyle],
      [handleIndicatorStyle],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={memoSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        enableDismissOnClose={enableDismissOnClose}
        enableDynamicSizing={enableDynamicSizing}
        onChange={handleChange}
        onAnimate={handleAnimate}
        backgroundStyle={defaultBackgroundStyle}
        handleIndicatorStyle={
          showHandleIndicator ? defaultHandleIndicatorStyle : undefined
        }
        containerStyle={containerStyle}
        backdropComponent={renderBackdrop}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode={android_keyboardInputMode}
      >
        <BottomSheetView style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {children}
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BottomSheetComp.displayName = 'BottomSheetComp';

export default BottomSheetComp;

const styles = StyleSheet.create({
  defaultBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  defaultHandleIndicator: {
    backgroundColor: colors.c_DDDDDD,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
