export class Colors {

    static colors = [
        '#008744',
        '#0057e7',
        '#d62d20',
        '#ffa700'
    ]

    private static nextIndex = 0;

    static nextColor(){
        let color = Colors.colors[Colors.nextIndex % Colors.colors.length];
        Colors.nextIndex++;
        return color;
    }

}