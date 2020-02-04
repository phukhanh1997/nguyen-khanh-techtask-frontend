import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import axios from 'axios'

const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            mainDiv: {
                paddingLeft: '20%',
                paddingRight: '20%',
                paddingTop: '5%',
            },
            formControl: {
                paddingRight: '5%',
            },
            divIngredient: {
                paddingLeft: '10%',
            },
            btn: {
                border: 'black solid 1px',
                marginTop: '24px',
                marginBottom: '12px',
                backgroundColor: 'orange',
            }
        }),
);
export default function InterViewTest() {
    const classes = useStyles();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const currentDate = `${yyyy}-${mm}-${dd}`;
    const [selectedDate, setSelectedDate] = React.useState();
    const [ingredients, setIngredients] = React.useState([{
        "title": "",
        "use-by": "",
    }]);
    const [chooseIngredients, setChooseIngredients] = React.useState<string[]>([]);
    const [recipes, setRecipes] = React.useState([{
        "title": "",
        "ingredients": [""]
    }]);
    
    const handleSelectDate = (event: any) => {
        setSelectedDate(event.target.value);
    }

    const isDisable = (value: string) => {
        const currentDate = new Date();
        const valueDate = new Date(value);
        if(currentDate>= valueDate) {
            return true;
        }
        else return false;
    }

    // console.log("abcxyz", ingredients);
    const handleClickFridge = async () => {
        const data = (await axios.get("https://lb7u7svcm5.execute-api.ap-southeast-1.amazonaws.com/dev/ingredients")).data;
        setIngredients(data);
    }
    const handleCheck = (value: string) => {
        const chooseIngredient = [...chooseIngredients];
        if(chooseIngredient.includes(value)) {
            const index = chooseIngredient.indexOf(value);
            chooseIngredient.splice(index, 1);
            setChooseIngredients(chooseIngredient);
            return;
        }
        if(!chooseIngredient.includes(value)) {
            chooseIngredient.push(value);
            setChooseIngredients(chooseIngredient);
            return;
        }
    }
    const listIngredients = [];
    if(ingredients.length > 1 ) {
        for(let i = 0; i < ingredients.length; i++) {
            listIngredients.push(
                <FormControlLabel className={classes.formControl}
                    control={
                        <Checkbox disabled={isDisable(ingredients[i]["use-by"])} onChange={() => handleCheck(ingredients[i].title)}></Checkbox>
                    }
                    label={ingredients[i].title}
                />
            )
        }
    }
    const seeRecipe = async () => {
        let queryString = chooseIngredients[0];
        for(let i = 1; i<chooseIngredients.length; i++) {
            queryString = queryString.concat("," + chooseIngredients[i]);
        }
        const data = (await axios.get(`https://lb7u7svcm5.execute-api.ap-southeast-1.amazonaws.com/dev/recipes?ingredients=${queryString}`)).data;
        setRecipes(data);
    }
    const returnIngredient = (ingredientsValue: any) => {
        const listIngredient = [];
        for(let i=0; i< ingredientsValue.length; i++) {
            console.log(ingredientsValue[i]);
            listIngredient.push(
                <div className={classes.divIngredient}>
                    <span>{ingredientsValue[i]}</span>
                </div>
            )
        }
        return listIngredient;
    }
    const listRecipe = [];
    if(recipes.length> 1) {
        for(let i =0; i<recipes.length; i++) {
            listRecipe.push(
                <div>
                    <h3>Recipe for {recipes[i]["title"]} :</h3>
                    <h4>{returnIngredient(recipes[i]["ingredients"])}</h4>
                </div>
            )
        }
    }
    
    return (
        <div className={classes.mainDiv}>
            <div>
                Select your preference lunch date <br/>
                <TextField
                    type="date"
                    defaultValue={currentDate}
                    onChange={handleSelectDate}>
                </TextField>
            </div>
            <div>
                <Button onClick={handleClickFridge} className={classes.btn}>
                    See what in your fridge
                </Button>
            </div>
            <div>
                {listIngredients}
            </div>
            { ingredients.length > 1 && <div>
                <Button onClick={seeRecipe} disabled={chooseIngredients.length ===0} className={classes.btn}>
                    See Recipe
                </Button>
                <div>
                    {listRecipe}
                </div>
            </div>}
        </div>
    )
}

ReactDOM.render(<InterViewTest />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
