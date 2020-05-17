export function bind(data) {
    return {
        onkeyup: function (e) {
            data[e.target.id] = e.target.value;
        }
    };
};


export function targetValue(e: Event){
    return (e.target as HTMLInputElement).value;
}
