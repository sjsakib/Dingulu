import { defaultTags } from './constants';
import { AsyncStorage } from 'react-native';

export default function populate() {
    const end = new Date();
    const pairs = [];
    for (
        let date = new Date('01/01/2018');
        date < end;
        date.setDate(date.getDate() + 1)
    ) {
        const numberOfTags = randInt(4);
        const selected = [];
        for (let i = 0; i < numberOfTags; i++) {
            const tag = defaultTags[randInt(defaultTags.length-1)];
            tag.level = randInt(2);
            selected.push(tag);
        }
        const note = `Today is ${date.toString()}`;
        pairs.push([date.toLocaleDateString(), JSON.stringify({selected, note})]);
    }
    AsyncStorage.multiSet(pairs);
}

function randInt(n) {
    return Math.floor(Math.random() * (n + 1));
}