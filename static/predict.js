$("#image-selector").on('change', function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 

//$("#model-selector").on('change', function () {
//    loadModel($("#model-selector").val());
//});

let model;
$("#load-button").on('click', async () => {
    model = $("#model-selector").val();
    $(".first-pbar").show();
    //model = undefined;
    const currUrl = $(location).attr('href')
    model = await tf.loadLayersModel(`${currUrl}/tfjs-models/${model}/model.json`);
    $(".first-pbar").hide();
})


$("#predict-button").on('click', async () => {
    let image = $("#selected-image").get(0)
    let modelName = $("#model-selector").val()
    let tensor = preprocessImage(image, modelName)
    
    let predictions = await model.predict(tensor).data()
    let top5 = Array.from(predictions)
        .map(function (p,i) {
            return {
                probability: p,
                className: IMAGENET_CLASSES[i]
            }
        }).sort(function (a,b) {
            return b.probability - a.probability
        }).slice(0, 5)
    
        $("#prediction-list").empty()
        top5.forEach(function (p){
            $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)} </li>`)
        })
})

function preprocessImage(image, modelName) {
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224,224])
        .toFloat()

    if (modelName === undefined) {
        return tensor.expandDims();
    }
    else if (modelName === "VGG16") {
        let meanImageNetRGB = tf.tensor1d([123.68, 116.779, 103.939]);
        return tensor.sub(meanImageNetRGB)
            .reverse(2)
            .expandDims();
    }
    else if (modelName === "MobileNet") {
        let offset = tf.scalar(127.5);
        return tensor.sub(offset)
            .div(offset)
            .expandDims();
    }
    else {
        throw new Error("Unknown model name");
    }
}

