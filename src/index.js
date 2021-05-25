require('@/styles/common.scss');
// import "@/styles/common.scss";

window.onload = () => {
    let hello = 'hello world';

    console.log(hello);

    const fun = (val) => {
        console.log(val);
    };

    document.getElementById('app').innerHTML = hello;
};

/**
 * @returns {void}
 */
function test () {
    console.log('test');
}

/**
 * @returns {void}
 */
function test2 () {
    console.log('test2');
}
