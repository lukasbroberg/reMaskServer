import e from "express";
import supabase from '../supabase.js';

const router = e.Router();

/**
 * Post new costume to database
 */
router.post('/addUserItem', async (req,res) => {

    const {name, description, size} = req.body;
    const inventoryId = 3 //Todo implementer senere, når vi har session Id fra login

    const {data, error} = await supabase.from('items').insert([
        {
            item_name: name,
            item_description: description,
            item_size: size,
            inventory_id: inventoryId,
        }
    ])

    if(error){
        console.log(error)
        res.json({success: false, message: 'Unable to insert new costume'})
    }
    res.json({success: true, message: 'inserted costume'});
})

/**
 * To fetch own user items based on session id (mangler sessionId fra login)
 */
router.get('/fetchItems', async (req, res) => {
    const userId = 3 //req.session.id... Todo implement as sessionId
    let { data: items, error } = await supabase
    .from('user_items')
    .select()
    .eq('owner',userId);


    if(error){
        res.json({success: false, message: 'unable to get users costumes'})
        console.log(error)
    }

    res.json({ success: true, costumes: items })
})

export const inventoryRouter = router;