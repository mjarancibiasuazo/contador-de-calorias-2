import { ReactNode, createContext, useMemo, useReducer } from "react";
import { ActivityState, ActivityActions, activityReducer, initialState } from "../reducers/activity-reducer";
import { categories } from "../data/categories";
import { Activity } from "../types";

//CREACIÓN DEL CONTEXTO Y PROVEEDOR (CONFIGURACIÓN CONTEXT)
type ActivityProviderProps = {
    children: ReactNode
}

//Props del Context
type ActivityContextProps = {
    state: ActivityState
    dispatch: React.Dispatch<ActivityActions>
    caloriesConsumed: number
    caloriesBurned: number
    netCalories: number
    categoryName: (category: Activity['category']) => string[]
    isEmptyActivities: boolean
}

//Creamos el Context y el <ActivityContextProps>
export const ActivityContext = createContext<ActivityContextProps>(null!)


export const ActivityProvider = ({ children } : ActivityProviderProps) => {

    //useReducer
    const [state, dispatch] = useReducer(activityReducer, initialState)

    // Contadores
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [ state.activities])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [ state.activities ])
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [ state.activities ])

    const categoryName = useMemo(() => 
        (category: Activity['category']) => categories.map( cat => cat.id === category ? cat.name : '' )
    , [state.activities])
    
    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])

    return (
        <ActivityContext.Provider value = {{
            state, 
            dispatch,
            caloriesConsumed,
            caloriesBurned,
            netCalories,
            categoryName,
            isEmptyActivities


        }}>
            {children}

        </ActivityContext.Provider>
    )
}