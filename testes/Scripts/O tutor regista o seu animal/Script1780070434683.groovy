import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser(null)

WebUI.navigateToUrl('https://kamylu.github.io/Aplica-o_SAV/')

WebUI.setEncryptedText(findTestObject('Page_SAV  Portal do Tutor/input_'), '4nvbrPglk7k=')

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/button_Entrar na Aplicao'))

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/button_Adicionar Animal'))

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_Ex_ 900444555'), '123456789')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_Nome'), 'Adriana')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '0')

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'))

WebUI.doubleClick(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'))

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '1')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '2')

WebUI.doubleClick(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'))

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '3')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '4')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '5')

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_animal-idade-input'), '6')

WebUI.selectOptionByValue(findTestObject('Page_SAV  Portal do Tutor/select_animal-especie-input'), 'Furão', false)

WebUI.selectOptionByValue(findTestObject('Page_SAV  Portal do Tutor/select_animal-raca-input'), 'Champagne', false)

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_Ex_ 10.5'), '19')

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/button_Validar e Concluir'))

