import Toggle from './Toggle';
import styles from '../../styles/toggleleftpanel.module.css';

const ToggleLeftPanel = () => {
    const jsonData = {
        "sub1": {
            "EdTech": [
                {Key: "Horizontal", Kind: "sub1"},
                {Key: "Rural Education", Kind: "sub1"},
                {Key: "School, Higher Education, Literacy", Kind: "sub1"},
            ],
            "FoodTech": [
                {Key: "Horizontal", Kind: "sub1"},
                {Key: "Plant based meat", Kind: "sub1"},
                {Key: "Public Markets", Kind: "sub1"},
                {Key: "Robotization", Kind: "sub1"}
            ],
            "FinTech": [
                {Key: "Lending", Kind: "sub1"},
                {Key: "Payments", Kind: "sub1"},
            ],
            "CleanTech": [
                {Key: "Batteries", Kind: "sub1"},
                {Key: "Electric Vehicles", Kind: "sub1"},
                {Key: "Green Hydrogen", Kind: "sub1"},
            ],
            "DeepTech": [
                {Key: "AL/ML", Kind: "sub1"},
                {Key: "Generative AI", Kind: "sub1"},
                {Key: "Semiconductor", Kind: "sub1"}
            ],
            "HRTech": [
                {Key: "UpSkilling", Kind: "sub1"},
                {Key: "Work", Kind: "sub1"}
            ],
            "ECommerce": [
                {Key: "D2C", Kind: "sub1"}
            ],
        }
    };

    const foodTechElements = jsonData.sub1.FoodTech;
    const finTechElements = jsonData.sub1.FinTech;
    const edTechElements = jsonData.sub1.EdTech;
    const cleanTechElements = jsonData.sub1.CleanTech;
    const hrTechElements = jsonData.sub1.HRTech;
    const deepTechElements = jsonData.sub1.DeepTech;
    const ecommerceElements = jsonData.sub1.ECommerce;


    return (
        <div>
            <div className={styles.leftPanel}>
                <div className={styles.leftPanelHeaderSectors}><div className={styles.headerText}>Top Sectors</div></div>
                <Toggle options={foodTechElements} header={"FoodTech"} />
                <Toggle options={finTechElements} header={"FinTech"} />
                <Toggle options={edTechElements} header={"EdTech"} />
                <Toggle options={cleanTechElements} header={"CleanTech"} />
                <Toggle options={hrTechElements} header={"HRTech"} />
                <Toggle options={deepTechElements} header={"DeepTech"} />
                <Toggle options={ecommerceElements} header={"ECommerce"} />
            </div>
            

        </div>

    )
}

export default ToggleLeftPanel;