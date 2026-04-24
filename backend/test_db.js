const supabase = require('./supabaseClient');

async function test() {
    const { data, error } = await supabase
        .from('users')
        .upsert({
            id: '1234567890',
            username: 'TestUser',
            avatar_url: null
        }, { onConflict: 'id' })
        .select()
        .single();
    
    if (error) {
        console.error("TEST ERROR:", error);
    } else {
        console.log("TEST SUCCESS:", data);
    }
}
test();
