import { StyleSheet } from "react-native";

const GeneralStyles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    justifyContent: {
        justifyContent: "center"
    },
    alignItems: {
        alignItems: "center"
    },
    gap: {
        gap: 10
    },
    paddingHorizontal: {
        paddingHorizontal: 20
    },
    paddingVertical: {
        paddingVertical: 20
    },
    marginBottom: {
        marginBottom: 20
    },
    marginTop: {
        marginTop: 20
    },
    flexGrow: {
        flexGrow: 1
    },
    paddingBottom: {
        paddingBottom: 30
    },
    flexDirection: { flexDirection: "row" },
    shadow: {
        // iOS Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.09,       // #00000026 ≈ 0.15 opacity
        shadowRadius: 5,

        // Android Shadow
        elevation: 5,
    },
    rounded: {
        borderRadius: 100
    }
});

export default GeneralStyles;