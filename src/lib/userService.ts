import User from '@/Models/User';
import Feature from '@/Models/Feature';
import Connector from '@/Models/Connector';

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


export async function updateOrCreateConnector(userEmail: string, connectorType: string, newConnectorData: object) {
    // Validate the connector type
    const validConnectorTypes = ['ga4', 'facebook', 'dv360', 'googleAds', 'linkedIn'];
    if (!validConnectorTypes.includes(connectorType)) {
        throw new Error('Invalid connector type');
    }

    // Step 1: Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        throw new Error('User not found');
    }

    // Step 2: Check if the user has any feature associated with them
    let feature = user.features.length > 0 ? await Feature.findById(user.features[0]) : null;

    if (!feature) {
        // If no feature exists, create one
        feature = new Feature({});
        await feature.save();

        // Reference the new feature in the user's document
        user.features = [feature._id];
        await user.save();
    }

    // Step 3: Find or create the specific connector
    let connector = null;

    if (feature.connector) {
        connector = await Connector.findById(feature.connector);

        if (connector) {
            // Update the specific connector type with the new data
            connector[connectorType] = { ...connector[connectorType], ...newConnectorData };
            await connector.save();
        } else {
            // If no connector exists, create a new one
            connector = new Connector({ [connectorType]: newConnectorData });
            await connector.save();

            // Update the feature to reference the new connector
            feature.connector = connector._id;
            await feature.save();
        }
    } else {
        // If no connector exists, create a new one
        connector = new Connector({ [connectorType]: newConnectorData });
        await connector.save();

        // Reference the new connector in the feature document
        feature.connector = connector._id;
        await feature.save();
    }

    // Step 4: Ensure the connector is referenced in the user's connectors array
    if (!user.connectors.includes(connector._id)) {
        user.connectors.push(connector._id);
        await user.save();
    }

    return { user, feature, connector };
}