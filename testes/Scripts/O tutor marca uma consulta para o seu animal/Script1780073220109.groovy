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

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/button_nav-marcar'))

WebUI.selectOptionByValue(findTestObject('Page_SAV  Portal do Tutor/select_marcar-select-animal'), '900777333', false)

WebUI.selectOptionByValue(findTestObject('Page_SAV  Portal do Tutor/select_marcar-select-clinica'), 'SAV Aveiro Sul', false)

WebUI.setText(findTestObject('Page_SAV  Portal do Tutor/input_marcar-data-input'), '2026-05-31')

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/div_18_00'))

WebUI.click(findTestObject('Page_SAV  Portal do Tutor/button_Reservar Consulta'))

