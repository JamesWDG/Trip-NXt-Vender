import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Minus, Plus } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CounterProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
}

const Counter: React.FC<CounterProps> = ({
  label,
  value,
  onDecrease,
  onIncrease,
  min = 0,
  max = 99,
}) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !canDecrease && styles.buttonDisabled,
          ]}
          onPress={onDecrease}
          disabled={!canDecrease}
          activeOpacity={0.7}>
          <Minus
            size={18}
            color={canDecrease ? colors.c_666666 : colors.c_CFD1D3}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonActive,
            !canIncrease && styles.buttonDisabled,
          ]}
          onPress={onIncrease}
          disabled={!canIncrease}
          activeOpacity={0.7}>
          <Plus
            size={18}
            color={canIncrease ? colors.white : colors.c_CFD1D3}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.c_F59523,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});


