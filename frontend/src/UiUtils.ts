export function bind(data) {
    return {
        onchange: function (e) {
            data[e.target.id] = e.target.value;
        }
    };
};
