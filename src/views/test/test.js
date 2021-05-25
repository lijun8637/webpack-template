window.onload = () => {
    let hello = 'hello test';

    console.log(hello);

    document.getElementById('app').innerHTML = hello;
};

/**
 * @returns {void}
 */
function test () {
    console.log('test');
}
