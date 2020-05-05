export function bind(data) {
    return {
        onkeyup: function (e) {
            data[e.target.id] = e.target.value;
        }
    };
};
