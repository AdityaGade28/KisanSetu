import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

def parse_args():
    parser = argparse.ArgumentParser(description="KisanSetu MobileNetV2 Plant Disease Training Pipeline")
    parser.add_argument("--data_dir", type=str, default="./dataset", help="Directory of the dataset")
    parser.add_argument("--epochs", type=int, default=25, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=0.001, help="Initial learning rate")
    parser.add_argument("--output_model", type=str, default="plant_disease_model.keras", help="Target filename for trained Keras model")
    parser.add_argument("--export_tflite", type=bool, default=True, help="Whether to export to TensorFlow Lite format")
    return parser.parse_args()

def load_data(data_dir, batch_size, img_size=(224, 224)):
    print(f"[*] Scanning data directory: {data_dir}")
    if not os.path.exists(data_dir):
        print(f"[!] Warning: Data directory '{data_dir}' not found. Creating placeholder structure for training demonstration.")
        os.makedirs(data_dir, exist_ok=True)
        # Create standard placeholder subfolders matching dataset classes
        classes = ["Healthy", "Tomato_Early_Blight", "Tomato_Late_Blight", "Potato_Early_Blight", "Potato_Late_Blight", "Corn_Common_Rust"]
        for cls in classes:
            os.makedirs(os.path.join(data_dir, cls), exist_ok=True)
            # Create a simple dummy image so dataset loading does not fail
            dummy_img = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
            from PIL import Image
            Image.fromarray(dummy_img).save(os.path.join(data_dir, cls, "placeholder.jpg"))
            
    # Load dataset with an 80/20 train/validation split
    train_ds = keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical"
    )

    val_ds = keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical"
    )
    
    return train_ds, val_ds

def build_model(num_classes, img_size=(224, 224)):
    print("[*] Instantiating MobileNetV2 Base Model with Transfer Learning...")
    # Base Model pretrained on ImageNet
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(img_size[0], img_size[1], 3),
        include_top=False,
        weights="imagenet"
    )
    
    # Freeze the base model to leverage learned weights
    base_model.trainable = False
    
    # Preprocessing and Augmentation Layers
    data_augmentation = keras.Sequential([
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.15),
        layers.RandomFlip("horizontal"),
        layers.RandomTranslation(height_factor=0.1, width_factor=0.1),
    ])

    # Connect pipeline: Augmentation -> Preprocessing Normalization -> Base MobileNetV2 -> Custom Head
    inputs = layers.Input(shape=(img_size[0], img_size[1], 3))
    x = data_augmentation(inputs)
    # MobileNetV2 expects inputs in range [-1, 1], Rescaling layer converts [0, 255] appropriately
    x = layers.Rescaling(scale=1./127.5, offset=-1)(x)
    x = base_model(x, training=False)
    
    # Custom classifier head with global pooling and Dropout
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    
    model = models.Model(inputs, outputs)
    return model

def main():
    args = parse_args()
    
    # Load dataset classes
    train_ds, val_ds = load_data(args.data_dir, args.batch_size)
    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"[*] Identified {num_classes} plant classes: {class_names}")

    # Build model architecture
    model = build_model(num_classes)
    
    # Optimize network pipeline using prefetching to speed up train latency
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

    # Compile with Adam optimizer and Categorical Crossentropy Loss
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=args.lr),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    model.summary()

    # Define training callbacks for early stopping and check-pointing
    callbacks = [
        EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=3,
            min_lr=1e-6,
            verbose=1
        ),
        ModelCheckpoint(
            filepath=args.output_model,
            monitor="val_loss",
            save_best_only=True,
            verbose=1
        )
    ]

    print(f"[*] Starting MobileNetV2 Transfer Learning for {args.epochs} Epochs...")
    history = model.fit(
        train_ds,
        epochs=args.epochs,
        validation_data=val_ds,
        callbacks=callbacks
    )

    print(f"[+] Model training completed. Best model saved successfully to: {args.output_model}")

    # Optional export to TensorFlow Lite for ultra-fast, low-latency mobile deployment
    if args.export_tflite:
        print("[*] Converting best Keras model to optimized TensorFlow Lite format...")
        try:
            converter = tf.lite.TFLiteConverter.from_keras_model(model)
            tflite_model = converter.convert()
            tflite_path = args.output_model.replace(".keras", ".tflite").replace(".h5", ".tflite")
            with open(tflite_path, "wb") as f:
                f.write(tflite_model)
            print(f"[+] TensorFlow Lite model exported successfully to: {tflite_path}")
        except Exception as e:
            print(f"[!] Failed to convert to TFLite: {str(e)}")

if __name__ == "__main__":
    main()
