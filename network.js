class NeuralNetwork{
    constructor(neuronCounts) { // this parameter is an array of number of neurons per level.
        this.levels = [];
        for (let i=0; i < neuronCounts.length - 1; i++){
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1]));
        }
    }

    static feedForward(givenInputs,network){
        let outputs = Level.feedForward(givenInputs,network.levels[0]);
        for (let i=1; i<network.levels.length;i++){
            outputs = Level.feedForward(outputs,network.levels[i]);
        }
        return outputs;
    }

    static mutate(network,amount=1){
        // amount is the amount of mutation. 100% will randomize everything.
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }


            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; i++) {
                    level.weights[i][j] = lerp(level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount);
                }
            }
        });
    }
}



class Level{ //A level has a layer of input neurons and a layer of output neurons.
    constructor(inputCount,outputCount) {
        this.inputs = new Array(inputCount); //these are all actual neurons to define input neurons.
        this.outputs = new Array(outputCount); // these are all actual neurons to define output neurons.
        this.biases = new Array(outputCount); // this is a value above which the output neurons fire responses.
        //when coding this, every input neuron is connected to every output neuron. However, each of these connections have weights.
        this.weights = [];
        for (let i=0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount); // inside the brackets, it is the array Length.
        }

        //note: the weights array is a 2D array. This is because each array inside the weights array is an input neuron.
        // One input neuron has weights for all the output neurons as each input neuron is connected to all output neurons but with different weights,

        Level.#randomize(this);
    }

    static #randomize(level){
        //static method helps in serializing the object.
        for (let i=0;i < level.inputs.length; i++){
            for (let j=0; j < level.outputs.length; j++){
                level.weights[i][j] = Math.random() * 2 - 1; // this is to generate a random number between 0 and 1.
                //the negative weight represents a negative response.
            }
        }
        for (let i=0; i<level.biases.length;i++){
            level.biases[i] = Math.random() * 2 -1;
        }
        // here, the input is the value coming from the car sensors. the output is calculated from the weights and biases.
        //we will compute the output using Feed Forward algorithm.
    }

    static feedForward(givenInput,level){
        for (let i=0; i<level.inputs.length;i++){
            level.inputs[i] = givenInput[i];
        } // setting the input array to the given Input.

        for (let i=0; i < level.outputs.length; i++){
            let sum = 0;
            for (let j=0; j < level.inputs.length; j++){
                sum += level.inputs[j] * level.weights[j][i];
            }
            if (sum > level.biases[i]){ // refer the notes.txt for some info.
                level.outputs[i] = 1;
            }
            else {
                level.outputs[i] = 0;
            }
        } // calculate the output using a simple feed forward algorithm.
        return level.outputs;
    }
}