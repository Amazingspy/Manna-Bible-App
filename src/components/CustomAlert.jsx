import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const CustomAlert = ({ 
    visible, 
    title, 
    message, 
    onClose, 
    onConfirm, 
    confirmText = 'OK', 
    cancelText = 'Cancel', 
    type = 'error' 
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity 
                    style={styles.backdrop} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                
                <View style={styles.container}>
                    <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                        <View style={styles.content}>
                            {/* Icon Header */}
                            <View style={[
                                styles.iconContainer, 
                                { backgroundColor: type === 'error' ? '#FF4B4B' : (type === 'confirm' ? '#FFD700' : '#1B365C') }
                            ]}>
                                <MaterialIcons 
                                    name={type === 'error' ? "error-outline" : (type === 'confirm' ? "logout" : "info-outline")} 
                                    size={32} 
                                    color={type === 'confirm' ? "#1B365C" : "white"} 
                                />
                            </View>

                            {/* Text Content */}
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                {onConfirm && (
                                    <TouchableOpacity 
                                        onPress={onClose}
                                        style={[styles.button, styles.cancelButton]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                    </TouchableOpacity>
                                )}
                                
                                <TouchableOpacity 
                                    onPress={onConfirm || onClose}
                                    style={[styles.button, onConfirm ? styles.confirmButton : styles.singleButton]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={onConfirm ? styles.confirmButtonText : styles.buttonText}>
                                        {onConfirm ? confirmText : 'Got it'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: width * 0.85,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    blurContainer: {
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    singleButton: {
        backgroundColor: '#FFD700',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#FFD700',
        flex: 1.5,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        flex: 1,
    },
    buttonText: {
        color: '#1B365C',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    confirmButtonText: {
        color: '#1B365C',
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    cancelButtonText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
});

export default CustomAlert;
