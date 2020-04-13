import { Colors } from "../Colors";

test('nextColor', () => {
    Colors.colors = ['red', 'green', 'blue'];
    expect(Colors.nextColor()).toBe('red');
    expect(Colors.nextColor()).toBe('green');
    expect(Colors.nextColor()).toBe('blue');
    expect(Colors.nextColor()).toBe('red');
})