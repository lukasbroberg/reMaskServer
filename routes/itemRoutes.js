import e from "express";
import supabase from '../supabase.js';

const router = e.Router();

/**
 * Fetch all costumes from other users
 */
router.get(`/fetchAllItems`, async (req, res) => {
    const searchParam = req.query.search;
    
    if(!searchParam){
        let { data: items, error } = await supabase
            .from('costumes')
            .select()
        
        if (error) {
            console.log(error);
            return res.json({ success: false, message: 'unable to get newest posted costumes' })
        }
        return res.json({ success: true, costumes: items });
    }else{
        let { data: items, error } = await supabase
            .from('costumes')
            .select()
            .ilike('item_name','%'+searchParam+'%')
    
        if (error) {
            console.log(error);
            return res.json({ success: false, message: 'unable to get newest posted costumes' })
        }
        return res.json({ success: true, costumes: items });
    }
    


})


export const itemRouter = router;
