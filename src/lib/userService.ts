import User from '@/Models/User';
import Feature from '@/Models/Feature';

export async function handleFirstFeatureVisit(email: string) {
    try {
        const user = await User.findOne({ email }).populate('features');

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the user already has a feature reference
        if (user.features.length === 0) {
            // Create a new feature document
            const newFeature = new Feature({
                // Initial fields, you can add default values or keep it empty
            });

            await newFeature.save();

            // Reference the new feature to the user
            user.features.push(newFeature._id);
            await user.save();
        }

        return user;
    }
    catch (err) {
        console.log("Issue in feture doc checking")
        throw new Error(`Error ${err}`)
    }
}
