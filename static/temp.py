import keras
import tensorflowjs as tfjs

mobilenet = keras.applications.mobilenet.MobileNet()

tfjs.converters.save_keras_model(mobilenet, 'MobileNet')