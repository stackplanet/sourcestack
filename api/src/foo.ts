import {
    Decorator,
    Query,
    Table,
} from "dynamo-types";


(async () => {

    let env = 'alpha';

    interface ICard {
        taskId: number;
        title: string;
    }


    @Decorator.Table({ name: env + "-Card" })
    class Card extends Table implements ICard {
        
        @Decorator.Attribute()
        public userId: string;
        
        @Decorator.Attribute()
        public taskId: number;

        @Decorator.Attribute()
        public title: string;



        @Decorator.FullPrimaryKey('userId', 'taskId')
        static readonly primaryKey: Query.FullPrimaryKey<Card, string, number>;

        // @Decorator.HashGlobalSecondaryIndex('userid')
        // static readonly userKey: Query.HashGlobalSecondaryIndex<Card, string>;

        @Decorator.Writer()
        static readonly writer: Query.Writer<Card>;
    }

    // Create Table At DynamoDB
    // console.log('dropping')
    // await Card.dropTable();
    await Card.createTable();

    // Drop Table At DynamoDB

    async function createCard(userid: string, title: string){
        const card = new Card();
        card.taskId = new Date().getTime();
        card.userId = userid;
        card.title = title;
        await card.save();
    }



    await createCard('jim', 'Jim 1')
    await createCard('jim', 'Jim 2')
    await createCard('bob', 'Bob 1')

    // Get Record
    let s = await Card.primaryKey.query({hash: 'jim'})
    s.records.forEach(c => console.log(c))



})()